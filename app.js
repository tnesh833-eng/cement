document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const jobContainer = document.getElementById('job-container');
    const searchInput = document.getElementById('search-input');
    const resultsCount = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');

    // Filters (checkboxes)
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    const budgetFilters = document.querySelectorAll('input[name="budget"]');
    const locationFilters = document.querySelectorAll('input[name="location"]');

    // Modal Elements
    const modal = document.getElementById('apply-modal');
    const modalContent = document.getElementById('modal-job-summary');
    const closeModal = document.querySelector('.close-modal');
    const applicationForm = document.getElementById('application-form');

    let currentJobs = [...window.freelanceJobs];

    // --- Core Functions ---
    function renderJobs(jobs) {
        jobContainer.innerHTML = '';

        if (jobs.length === 0) {
            jobContainer.innerHTML = `
                <div style="text-align:center; padding: 2rem; color: #666;">
                    <i class="fa-solid fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No jobs found matching your criteria.</p>
                </div>
            `;
            resultsCount.innerText = `Showing 0 jobs`;
            return;
        }

        resultsCount.innerText = `Showing ${jobs.length} jobs`;

        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';

            // Format Price
            const price = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumSignificantDigits: 3
            }).format(job.price);

            // Generate Tags HTML
            const tagsHtml = job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

            // Initials for Logo
            const initials = job.company.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            card.innerHTML = `
                <div class="job-header">
                    <div class="company-info">
                        <div class="company-logo">${initials}</div>
                        <div class="job-meta">
                            <h3>${job.title}</h3>
                            <h4>${job.company} <i class="fa-solid fa-circle-check verified-badge" title="Verified Client"></i></h4>
                        </div>
                    </div>
                    <div class="price-tag">${price}</div>
                </div>
                
                <div class="job-details">
                    <p>${job.description}</p>
                </div>
                
                <div class="tags-container">
                    ${tagsHtml}
                </div>
                
                <div class="card-footer">
                    <div class="location"><i class="fa-solid fa-map-marker-alt"></i> ${job.location}</div>
                    <div class="time-posted"><i class="fa-regular fa-clock"></i> ${job.postedTime}</div>
                    <button class="btn-apply-sm" onclick="openApplyModal(${job.id})">Apply Now</button>
                </div>
            `;

            // Allow card click also (except btn)
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    alert(`View details for: ${job.title}`);
                }
            });

            jobContainer.appendChild(card);
        });
    }

    function filterJobs() {
        // 1. Search Text
        const query = searchInput.value.toLowerCase();

        // 2. Categories
        const selectedCategories = Array.from(categoryFilters)
            .filter(c => c.checked)
            .map(c => c.value);

        // 3. Budgets (Complex logic simplified for demo)
        const selectedBudgets = Array.from(budgetFilters)
            .filter(b => b.checked)
            .map(b => b.value);

        // 4. Locations (Complex logic simplified)
        const selectedLocations = Array.from(locationFilters)
            .filter(l => l.checked)
            .map(l => l.value);

        currentJobs = window.freelanceJobs.filter(job => {
            // Text Match
            const matchesSearch = job.title.toLowerCase().includes(query) ||
                job.skills.some(s => s.toLowerCase().includes(query)) ||
                job.description.toLowerCase().includes(query);

            // Category Match
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);

            // Budget Match (Mock logic mapping ranges)
            let matchesBudget = true;
            if (selectedBudgets.length > 0) {
                // Simple mapping for demo based on strings 'low', 'medium', 'high', 'premium' in data
                matchesBudget = selectedBudgets.includes(job.budget);
            }

            // Location Match
            let matchesLocation = true;
            if (selectedLocations.length > 0) {
                // Check if job location contains keyword (e.g. 'Bangalore' match for 'bangalore')
                matchesLocation = selectedLocations.some(loc => job.location.toLowerCase().includes(loc));
            }

            return matchesSearch && matchesCategory && matchesBudget && matchesLocation;
        });

        sortJobs(); // Re-sort after filtering
    }

    window.sortJobs = () => {
        const sortValue = sortSelect.value;

        if (sortValue === 'budget-high') {
            currentJobs.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'budget-low') {
            currentJobs.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'newest') {
            // Mock sort by ID descending since we don't have real timestamps
            currentJobs.sort((a, b) => b.id - a.id);
        }

        renderJobs(currentJobs);
    };

    window.openApplyModal = (id) => {
        const job = window.freelanceJobs.find(j => j.id === id);
        if (!job) return;

        modalContent.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Client:</strong> ${job.company}</p>
            <p><strong>Budget:</strong> ₹${job.price}</p>
        `;

        modal.style.display = "block";
    };

    // --- Event Listeners ---

    // Search
    window.setSearch = (term) => {
        searchInput.value = term;
        filterJobs();
    };

    // Filters Change
    const allFilters = [...categoryFilters, ...budgetFilters, ...locationFilters];
    allFilters.forEach(f => f.addEventListener('change', filterJobs));

    // Clear Filters
    window.clearFilters = () => {
        allFilters.forEach(f => f.checked = false);
        searchInput.value = '';
        currentJobs = [...window.freelanceJobs];
        renderJobs(currentJobs);
    };

    // Modal Close
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    // Form Submit
    applicationForm.onsubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        const btn = applicationForm.querySelector('.btn-submit');
        const originalText = btn.innerText;
        btn.innerText = "Submitting...";
        btn.disabled = true;

        setTimeout(() => {
            alert("Success! Your proposal has been sent to the client.");
            modal.style.display = "none";
            applicationForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    };

    // Initial Render
    renderJobs(currentJobs);
});
