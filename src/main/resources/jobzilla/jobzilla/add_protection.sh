#!/bin/bash

# List of all files that need auth protection
files=(
  "candidate-dashboard.html"
  "candidate-cv-manager.html"
  "candidate-my-resume.html"
  "candidate-change-password.html"
  "candidate-chat.html"
  "candidate-job-alert.html"
  "candidate-jobs-applied.html"
  "candidate-saved-jobs.html"
  "candidate-list.html"
  "candidate-detail.html"
  "candidate-grid.html"
  "employer-profile.html"
  "employer-manage-jobs.html"
  "employer-post-job.html"
  "employer-change-password.html"
  "employer-detail.html"
  "employer-detail-v2.html"
  "employer-account-fresher.html"
  "employer-account-professional.html"
  "dashboard.html"
  "admin-jobs.html"
  "apply-job.html"
  "dash-bookmark.html"
  "dash-candidates.html"
  "dash-change-password.html"
  "dash-company-profile.html"
  "dash-employer.html"
  "dash-manage-jobs.html"
  "dash-messages.html"
  "dash-messages_2.html"
  "dash-my-profile.html"
  "dash-post-job.html"
  "dash-resume-alert.html"
)

# Protection script to add
PROTECTION='
    <!-- AUTH PROTECTION SCRIPT -->
    <script src="js/auth.js"><\/script>
    <script>
        \/\/ Check if user is logged in before page loads
        if (!canAccessProfilePage()) {
            document.body.style.opacity = '\''0'\'';
            document.body.style.pointerEvents = '\''none'\'';
        }
    <\/script>
    '

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Check if already has auth protection
    if grep -q "AUTH PROTECTION SCRIPT" "$file"; then
      echo "✓ $file already has protection"
    else
      # Add protection before </head> tag
      sed -i '' "/<\/head>/i\\
$PROTECTION
" "$file"
      echo "✓ Added protection to $file"
    fi
  else
    echo "✗ $file not found"
  fi
done
