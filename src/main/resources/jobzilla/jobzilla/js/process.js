document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabsContent = document.querySelectorAll('.tabs-content .tab');

    if (tabButtons.length > 0 && tabsContent.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove 'active-btn' from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active-btn'));
                // Add 'active-btn' to the clicked button
                this.classList.add('active-btn');

                const targetTabId = this.getAttribute('data-tab');

                // Hide all tab content
                tabsContent.forEach(content => content.classList.remove('active-tab'));

                // Show the target tab content
                const targetTab = document.querySelector(targetTabId);
                if (targetTab) {
                    targetTab.classList.add('active-tab');
                }
            });
        });
    }
});