# Portfolio Content & Asset TODOs

> **Build Gate Rule:** Running `STRICT_PROD=true npm run validate` fails if any skill `level`, project `case_study_todos` field, or non-upcoming `media.type` is still marked `"TODO"` / `"schematic_todo"`.

## 1. Project Authorship Confirmation (Mine vs. Team)
For each project, confirm whether it was built solo or collaboratively, and what specific parts you authored:
- [ ] **`p-humanoid` (Humanoid Sim):** Solo or Team? (Confirm details for `case_study_todos.my_role_vs_team`)
- [ ] **`p-titan-ugv` (Project Titan 3kg UGV):** Solo or Team?
- [ ] **`p-mechatronics-lab` (Mechatronics Lab C++):** Solo or Team?
- [ ] **`p-linefollower` (Line-Following Robot):** Solo or Team?
- [ ] **`p-ros2node` (ROS2 Sensor Fusion Node):** Solo or Team?
- [ ] **`p-kuka` (KUKA KR10 Planned):** Solo or Team?

## 2. Photo, Wording & Tag Confirmations
- [ ] **Project Titan Photo (`src/assets/images/projects/tug-bot.jpg`):** Top-down chassis photo shows exposed jumper wiring; `"Wiring is harnessed with strain relief."` has been removed from `p-titan-ugv.full_description`. Confirm whether to keep it removed or re-photograph.
- [ ] **Humanoid Sim Screenshot (`src/assets/images/projects/humanoid-sim.jpg`):** MuJoCo viewer screenshot shows the left settings panel and 15 FPS counter. Confirm whether to crop or replace.
- [ ] **`p-ros2node` Heading Wording:** Currently `"Complementary filter (α=0.98) fuses RPLidar scan-match yaw with IMU gyroscope"`. Confirm if you want to add specific phrasing about reducing gyro drift.
- [ ] **Removed Skill Tags (`Gazebo`, `BNO055`, `Nav2`, `URDF`, `xacro`):** Removed from `about`, `sk-ros2`, `sk-hardware`, and `sk-tools`. Confirm which of these you have used and want restored.

## 3. Skill Evidence Levels to Set (`src/data/portfolio.json -> skills[].level`)
Choose `"used on hardware"`, `"used in coursework"`, `"learning"`, or `"daily workflow"`:
- [ ] `sk-python`
- [ ] `sk-ros2`
- [ ] `sk-cpp`
- [ ] `sk-hardware`
- [ ] `sk-cad`
- [ ] `sk-tools`

## 4. Claims & Metrics to Verify (`journey`)
- [ ] **CGPA (`j-degree`):** Confirm `"8.2 / 10.0"`.
- [ ] **Competitions (`j-degree`):** Confirm Robowar podium & competition count.
- [ ] **Club Role & Workshop Headcounts (`j-robotics-club`):** Confirm SolidWorks lead role and 40+ attendees.
- [ ] **Self-Study Hours (`j-selflearn`):** Confirm 200+ hours / 15+ projects.
- [ ] **Internship (`j-ats-intern`):** Confirm any additional details for Automotive Test Systems (ATS).

## 5. Repository Links & Missing Media
- [ ] **`p-linefollower`:** Confirm dedicated GitHub repo URL and supply robot photo.
- [ ] **`p-ros2node`:** Confirm dedicated GitHub repo URL and supply `rviz2` screenshot.
- [ ] **`p-mechatronics-lab`:** Supply bench photo or architecture diagram.
- [ ] **`p-kuka` (Planned):** Supply RoboDK reach-envelope screenshot when available.
- [ ] **`about.media`:** Supply real `profile.jpg` (replacing the 1-byte placeholder) or leave `about.media.type` as `"none"`.
