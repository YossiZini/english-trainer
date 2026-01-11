# AI Image Generation Prompts for Gamification Levels

## Overview
Generate 6 images in Clash Royale arena style for the gamification feature. Each image should be:
- **Dimensions**: 800x600px (or 1200x900px for higher quality)
- **Format**: PNG with transparency where appropriate
- **Style**: Vibrant, cartoonish, game-like aesthetic similar to Clash Royale
- **Perspective**: Isometric or slightly angled view showing the arena

Save each image as `level-1.png`, `level-2.png`, etc. in `/frontend/public/images/levels/`

---

## Level 1: Training Camp
**File**: `level-1.png`

### Prompt:
```
A beginner training camp arena in Clash Royale style, cartoonish and vibrant. Wooden training ground with simple wooden fences and training dummies. Bright daytime lighting with blue sky. Simple grass ground. Small wooden towers on sides. Beginner-friendly, welcoming atmosphere. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Wooden structures and fences
- Training dummies
- Grass ground
- Bright, cheerful colors
- Beginner-friendly vibe

---

## Level 2: Goblin Stadium
**File**: `level-2.png`

### Prompt:
```
A goblin forest arena in Clash Royale style, cartoonish and vibrant. Green lush forest setting with goblin huts and wooden structures. Mossy stone walls. Dense trees in background. Nature-themed with vines and leaves. Two small goblin towers on sides. Forest clearing as battle arena. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Green forest environment
- Goblin huts and structures
- Mossy stones and wooden elements
- Lush vegetation
- Nature theme

---

## Level 3: Bone Pit
**File**: `level-3.png`

### Prompt:
```
A dark skeleton bone pit arena in Clash Royale style, cartoonish but spooky. Dark cave or underground setting with bone structures and skull decorations. Purple and dark blue color palette. Glowing purple crystals. Stone walls with bone ornaments. Two bone-themed towers on sides. Eerie but not too scary atmosphere. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Dark cave/underground setting
- Bones and skulls as decorations
- Purple glow and dark atmosphere
- Stone structures
- Spooky but cartoonish

---

## Level 4: Barbarian Bowl
**File**: `level-4.png`

### Prompt:
```
A barbarian warrior bowl arena in Clash Royale style, cartoonish and energetic. Red and orange color scheme. Stone colosseum-like structure with barbarian banners and flags. Torch lighting. Strong warrior theme with shields and axes as decorations. Two barbarian-themed towers on sides. Battle-worn stone ground. Aggressive but fun atmosphere. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Red/orange warrior theme
- Colosseum-like structure
- Barbarian decorations (shields, axes, flags)
- Stone construction
- Battle atmosphere

---

## Level 5: P.E.K.K.A's Playhouse
**File**: `level-5.png`

### Prompt:
```
A futuristic robot tech arena in Clash Royale style, cartoonish and mechanical. Silver and blue metallic color scheme. High-tech robotic structures with gears and circuits. Glowing blue lights and energy cores. Metal plated ground. Two robotic towers with mechanical details. P.E.K.K.A robot theme. Advanced technology vibe. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Metallic silver/blue colors
- Robot and tech theme
- Gears, circuits, mechanical details
- Glowing blue lights
- Futuristic atmosphere

---

## Level 6: Royal Arena
**File**: `level-6.png`

### Prompt:
```
A royal golden arena in Clash Royale style, cartoonish and majestic. Gold and purple royal color scheme. Ornate marble structures with golden decorations. Purple royal banners and flags. Crown motifs and royal symbols. Two majestic golden towers. Marble floor with golden patterns. Grand, prestigious atmosphere. Floating golden coins or sparkles. Isometric game view. Digital art, mobile game aesthetic. No text or UI elements.
```

### Key Elements:
- Gold and purple royal colors
- Marble and gold structures
- Royal decorations (crowns, banners)
- Majestic, prestigious feel
- Ornate details

---

## Technical Notes

### Recommended AI Tools:
1. **DALL-E 3** (via ChatGPT Plus or API)
   - Best for consistent style
   - Good at following detailed prompts

2. **Midjourney**
   - Excellent for game art style
   - May need prompt refinement
   - Use `--ar 4:3` for aspect ratio

3. **Stable Diffusion**
   - Free and customizable
   - May need multiple iterations
   - Use models trained on game art

### Generation Tips:
- Generate at higher resolution (1200x900 or 1600x1200)
- Downscale to 800x600 for web use
- Ensure consistent style across all 6 images
- Remove any text or UI that AI might add
- Adjust colors/contrast for web display

### Post-Processing:
1. Crop to consistent dimensions
2. Optimize file size (use PNG compression)
3. Test on dashboard to ensure visibility
4. Adjust brightness/contrast if needed

---

## Checklist

- [ ] Generate level-1.png (Training Camp)
- [ ] Generate level-2.png (Goblin Stadium)
- [ ] Generate level-3.png (Bone Pit)
- [ ] Generate level-4.png (Barbarian Bowl)
- [ ] Generate level-5.png (P.E.K.K.A's Playhouse)
- [ ] Generate level-6.png (Royal Arena)
- [ ] Optimize all images for web
- [ ] Place in `/frontend/public/images/levels/`
- [ ] Test display on dashboard

---

## Alternative: Using Placeholder Images

If you want to proceed with development before generating final images, you can use placeholder images temporarily. I can create a simple script to generate colored placeholder images with the arena names as text.
