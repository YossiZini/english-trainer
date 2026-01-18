import React, { useState, useEffect } from 'react';
import kanbanService from '../../services/kanbanService';
import './KanbanProgressPage.css';

const KanbanProgressPage = () => {
  const [tasks, setTasks] = useState({ backlog: [], in_progress: [], done: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        kanbanService.getTasksGrouped(),
        kanbanService.getStats()
      ]);

      setTasks(tasksData?.data || tasksData);
      setStats(statsData?.data || statsData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load Kanban data:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await kanbanService.updateTaskStatus(taskId, newStatus);
      loadData(); // Reload data after update
    } catch (err) {
      console.error('Failed to update task status:', err);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const getCategoryBadgeClass = (category) => {
    const baseClass = 'category-badge';
    return `${baseClass} ${baseClass}-${category}`;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      database: 'מסד נתונים',
      backend: 'Backend',
      frontend: 'Frontend',
      testing: 'בדיקות'
    };
    return labels[category] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="kanban-progress-page">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kanban-progress-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="kanban-progress-page">
      <div className="kanban-container">
        <div className="kanban-header">
          <h1>מעקב התקדמות - מערכת ניהול מילים משופרת</h1>
          <p>לוח Kanban לניהול משימות הפיתוח</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="kanban-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalTasks}</div>
              <div className="stat-label">סה"כ משימות</div>
            </div>
            <div className="stat-card backlog">
              <div className="stat-value">{stats.byStatus?.backlog || 0}</div>
              <div className="stat-label">Backlog</div>
            </div>
            <div className="stat-card in-progress">
              <div className="stat-value">{stats.byStatus?.in_progress || 0}</div>
              <div className="stat-label">בביצוע</div>
            </div>
            <div className="stat-card done">
              <div className="stat-value">{stats.byStatus?.done || 0}</div>
              <div className="stat-label">הושלם</div>
            </div>
            <div className="stat-card completion">
              <div className="stat-value">{stats.completionPercentage}%</div>
              <div className="stat-label">אחוז השלמה</div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {stats && stats.totalTasks > 0 && (
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-segment done"
                style={{ width: `${((stats.byStatus?.done || 0) / stats.totalTasks) * 100}%` }}
              ></div>
              <div
                className="progress-segment in-progress"
                style={{ width: `${((stats.byStatus?.in_progress || 0) / stats.totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="kanban-board">
          {/* Backlog Column */}
          <div className="kanban-column">
            <div className="column-header backlog">
              <h2>Backlog</h2>
              <span className="task-count">{tasks.backlog?.length || 0}</span>
            </div>
            <div className="column-content">
              {tasks.backlog && tasks.backlog.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    {task.category && (
                      <span className={getCategoryBadgeClass(task.category)}>
                        {getCategoryLabel(task.category)}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-footer">
                    {task.priority > 0 && (
                      <span className="task-priority">עדיפות: {task.priority}</span>
                    )}
                    <select
                      className="status-selector"
                      value="backlog"
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="in_progress">בביצוע</option>
                      <option value="done">הושלם</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="kanban-column">
            <div className="column-header in-progress">
              <h2>בביצוע</h2>
              <span className="task-count">{tasks.in_progress?.length || 0}</span>
            </div>
            <div className="column-content">
              {tasks.in_progress && tasks.in_progress.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    {task.category && (
                      <span className={getCategoryBadgeClass(task.category)}>
                        {getCategoryLabel(task.category)}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-footer">
                    {task.priority > 0 && (
                      <span className="task-priority">עדיפות: {task.priority}</span>
                    )}
                    <select
                      className="status-selector"
                      value="in_progress"
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="in_progress">בביצוע</option>
                      <option value="done">הושלם</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="kanban-column">
            <div className="column-header done">
              <h2>הושלם</h2>
              <span className="task-count">{tasks.done?.length || 0}</span>
            </div>
            <div className="column-content">
              {tasks.done && tasks.done.map((task) => (
                <div key={task.id} className="task-card completed">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    {task.category && (
                      <span className={getCategoryBadgeClass(task.category)}>
                        {getCategoryLabel(task.category)}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-footer">
                    {task.completed_at && (
                      <span className="completion-date">
                        הושלם: {formatDate(task.completed_at)}
                      </span>
                    )}
                    <select
                      className="status-selector"
                      value="done"
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="in_progress">בביצוע</option>
                      <option value="done">הושלם</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanProgressPage;
