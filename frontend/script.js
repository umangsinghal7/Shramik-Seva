// ----------------------------------------------------
// Shramik Seva Worker Profile Manager Logic
// Implements Key Features: Worker Profiles, Language/Theme Toggle, Status Tracker, Chatbox
// ----------------------------------------------------

// 1. Mock Data: Worker Profiles
let MOCK_WORKERS = [];

fetch('http://localhost:8000/workers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
            MOCK_WORKERS = data.data;
            renderWorkers(MOCK_WORKERS);
        }
        // If there is no data from the backend, the hardcoded mock data in the HTML will remain visible.
    })
    .catch(error => {
        console.error('Failed to fetch workers:', error);
        // If the fetch fails, the hardcoded mock data in the HTML will remain visible.
    });

// 2. Language Data for EN and HI
const TEXT_CONTENT = {
    EN: {
        headerTitle: "Shramik Seva",
        workerLogin: "Worker Login (Free)",
        employerAccess: "Login/Signup",
        heroTitle: "Connect Directly. No Middlemen.",
        heroSubtitle: "Your trusted, transparent, and fair platform for finding verified local workers (Shramik Seva).",
        findWorker: "Find a Worker",
        whyBetter: "Why We're Better",
        listingTitle: "Verified Local Worker Listings",
        filterTitle: "Filter Services",
        searchPlaceholder: "Search by skill (e.g., Plumber, Carpenter, Driver)",
        allLocations: "All Locations",
        searchButton: "Search",
        emptyMessage: "No workers matching your criteria.",
        chatNow: "Chat Now",
        call: "Call",
        uspTitle: "The Shramik Seva Difference",
        usp1Title: "Zero Commission",
        usp1Text: "Workers keep 100% of their earnings. No high commissions, ever.",
        usp2Title: "Direct Communication",
        usp2Text: "Families/Factories connect instantly. Eliminate middlemen and delays.",
        usp3Title: "Verified Reliability",
        usp3Text: "Access verified worker profiles built on community ratings and feedback.",
        workflowTitle: "Simple Workflow for Employers",
        step1Title: "Login/Signup",
        step1Text: "Login with verified, paid access.",
        step2Title: "Smart Search",
        step2Text: "Filter nearby workers by skill/location.",
        step3Title: "Direct Hire",
        step3Text: "Contact instantly via chat/call.",
        step4Title: "Feedback Loop",
        step4Text: "Rate and review to build trust.",
        testimonialTitle: "Trusted by Local Families and Businesses",
        pricingTitle: "Employer Subscription Plans",
        pricingSubtitle: "Gain verified, paid access to trusted workers directly. Choose the plan that fits your needs.",
        adminLink: "Admin Dashboard",
        trackerTitle: "Track Your Job Status",
        trackerSubtitle: "Enter your Job/Ticket ID to instantly view the current status of your worker request.",
        trackButton: "Track Status",
        statusInputPlaceholder: "Enter Job ID (e.g., SS-12345)",
        contact: "Contact: umangsinghal2007@gmail.com",
        chatHeader: "Shramik Seva Help",
    },
    HI: {
        headerTitle: "श्रमिक सेवा",
        workerLogin: "श्रमिक लॉगिन (निःशुल्क)",
        employerAccess: "लॉगिन/साइनअप",
        heroTitle: "सीधे जुड़ें। कोई बिचौलिया नहीं।",
        heroSubtitle: "सत्यापित स्थानीय श्रमिकों (श्रमिक सेवा) को खोजने के लिए आपका विश्वसनीय, पारदर्शी और निष्पक्ष मंच।",
        findWorker: "श्रमिक खोजें",
        whyBetter: "हम बेहतर क्यों हैं",
        listingTitle: "सत्यापित स्थानीय श्रमिक सूची",
        filterTitle: "सेवाएँ फ़िल्टर करें",
        searchPlaceholder: "कौशल से खोजें (जैसे, प्लंबर, बढ़ई, ड्राइवर)",
        allLocations: "सभी स्थान",
        searchButton: "खोज",
        emptyMessage: "आपके मानदंड से मेल खाने वाले कोई श्रमिक नहीं हैं।",
        chatNow: "अभी चैट करें",
        call: "कॉल करें",
        uspTitle: "श्रमिक सेवा का अंतर",
        usp1Title: "शून्य कमीशन",
        usp1Text: "श्रमिक अपनी कमाई का 100% रखते हैं। कोई उच्च कमीशन नहीं।",
        usp2Title: "सीधा संवाद",
        usp2Text: "परिवार/फैक्ट्री तुरंत जुड़ते हैं। बिचौलियों को खत्म करें।",
        usp3Title: "सत्यापित विश्वसनीयता",
        usp3Text: "सामुदायिक रेटिंग पर निर्मित सत्यापित श्रमिक प्रोफाइल तक पहुँचें।",
        workflowTitle: "नियोक्ताओं के लिए सरल कार्यप्रवाह",
        step1Title: "लॉगिन/साइनअप",
        step1Text: "सत्यापित, सशुल्क पहुँच के साथ लॉगिन करें।",
        step2Title: "स्मार्ट खोज",
        step2Text: "कौशल/स्थान के अनुसार आस-पास के श्रमिकों को फ़िल्टर करें।",
        step3Title: "सीधी भर्ती",
        step3Text: "चैट/कॉल के माध्यम से तुरंत संपर्क करें।",
        step4Title: "प्रतिक्रिया लूप",
        step4Text: "विश्वास बनाने के लिए रेटिंग दें और समीक्षा करें।",
        testimonialTitle: "स्थानीय परिवारों और व्यवसायों द्वारा विश्वसनीय",
        pricingTitle: "नियोक्ता सदस्यता योजनाएँ",
        pricingSubtitle: "सीधे विश्वसनीय श्रमिकों तक सत्यापित, सशुल्क पहुँच प्राप्त करें। अपनी आवश्यकताओं के अनुरूप योजना चुनें।",
        adminLink: "व्यवस्थापक डैशबोर्ड",
        trackerTitle: "अपनी नौकरी की स्थिति ट्रैक करें",
        trackerSubtitle: "अपनी नौकरी/टिकट आईडी दर्ज करें और तुरंत अपनी श्रमिक अनुरोध की वर्तमान स्थिति देखें।",
        trackButton: "स्थिति ट्रैक करें",
        statusInputPlaceholder: "नौकरी आईडी दर्ज करें (उदा. SS-12345)",
        contact: "संपर्क: umangsinghal2007@gmail.com",
        chatHeader: "श्रमिक सेवा सहायता",
    }
};

let currentLanguage = 'EN';
let currentTheme = 'light';

// 3. Main setup function
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const filterForm = document.getElementById('filter-form');
    const skillInput = document.getElementById('skill-input');
    const locationSelect = document.getElementById('location-select');
    const workersContainer = document.getElementById('workers-container');
    const emptyMessage = document.getElementById('empty-message');

    // Select new elements for features
    const languageToggle = document.getElementById('language-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const jobListContainer = document.querySelector('.job-list');

    const trackButton = document.getElementById('track-button');
    const jobIdInput = document.getElementById('job-id-input');

    const helpChatBox = document.getElementById('help-chat-box');
    const chatHeaderTitle = document.getElementById('chat-header-title');

    // Check for logged in user
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const workerLoginLink = document.getElementById('worker-login-link');
        const loginSignupLink = document.getElementById('login-signup-link');

        if (workerLoginLink) {
            workerLoginLink.style.display = 'none';
        }

        if (loginSignupLink) {
            const parent = loginSignupLink.parentElement;
            parent.removeChild(loginSignupLink);

            const userNameElement = document.createElement('span');
            userNameElement.className = 'text-gray-600 dark:text-gray-300 font-medium';
            userNameElement.textContent = user.name || user.email;
            parent.appendChild(userNameElement);

            const logoutButton = document.createElement('button');
            logoutButton.className = 'bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark transition transform hover:scale-[1.05]';
            logoutButton.textContent = 'Logout';
            logoutButton.onclick = () => {
                localStorage.removeItem('user');
                window.location.reload();
            };
            parent.appendChild(logoutButton);
        }
    }


    // --- THEME TOGGLE LOGIC ---
    // 4. Function to apply the theme state (includes scrollbar class update)
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            jobListContainer.classList.add('dark');
            themeIcon.setAttribute('data-lucide', 'moon');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            jobListContainer.classList.remove('dark');
            themeIcon.setAttribute('data-lucide', 'sun');
            localStorage.theme = 'light';
        }
        currentTheme = theme;
        lucide.createIcons();
    }

    // 5. Load initial theme from storage or system preference
    const savedTheme = localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    // 6. Theme Toggle Functionality
    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
    themeToggle.addEventListener('click', toggleTheme);


    // --- CHAT BOX LOGIC ---
    // 7. Toggle Chat Box Visibility (made global for inline HTML access)
    window.toggleChatBox = function () {
        const isOpen = helpChatBox.classList.contains('scale-100');
        if (isOpen) {
            helpChatBox.classList.remove('scale-100');
            helpChatBox.classList.add('scale-0');
        } else {
            helpChatBox.classList.remove('scale-0');
            helpChatBox.classList.add('scale-100');
        }
    }


    // --- LANGUAGE TOGGLE LOGIC ---
    // 8. Language Change Functionality
    function applyLanguage(lang) {
        const text = TEXT_CONTENT[lang];

        // Header
        document.querySelector('h1.text-3xl').textContent = text.headerTitle;
        const workerLoginLink = document.getElementById('worker-login-link');
        if(workerLoginLink) workerLoginLink.textContent = text.workerLogin;
        const loginSignupLink = document.getElementById('login-signup-link');
        if(loginSignupLink) loginSignupLink.textContent = text.employerAccess;

        // Hero Section
        document.querySelector('h1.leading-tight').innerHTML = text.heroTitle.replace('. No Middlemen.', '. <span class="text-secondary block sm:inline">No Middlemen.</span>');
        document.querySelector('p.max-w-3xl').textContent = text.heroSubtitle;
        document.querySelector('a[href="#worker-listings"]').innerHTML = `<i data-lucide="search" class="w-5 h-5 mr-2"></i> ${text.findWorker}`;
        document.querySelector('a[href="#usp-section"]').textContent = text.whyBetter;

        // Worker Listings
        document.querySelector('#worker-listings h2').textContent = text.listingTitle;
        document.querySelector('.bg-white h3.text-xl').textContent = text.filterTitle;
        skillInput.placeholder = text.searchPlaceholder;
        document.querySelector('#location-select option[value=""]').textContent = text.allLocations;
        document.querySelector('button[type="submit"]').textContent = text.searchButton;
        emptyMessage.textContent = text.emptyMessage;

        // USP Section
        document.querySelector('#usp-section h2').innerHTML = text.uspTitle.replace('Difference', '<span class="text-primary">Difference</span>');
        document.querySelector('#usp-section .grid div:nth-child(1) h3').textContent = text.usp1Title;
        document.querySelector('#usp-section .grid div:nth-child(1) p').textContent = text.usp1Text;
        document.querySelector('#usp-section .grid div:nth-child(2) h3').textContent = text.usp2Title;
        document.querySelector('#usp-section .grid div:nth-child(2) p').textContent = text.usp2Text;
        document.querySelector('#usp-section .grid div:nth-child(3) h3').textContent = text.usp3Title;
        document.querySelector('#usp-section .grid div:nth-child(3) p').textContent = text.usp3Text;

        // Testimonials title is handled by class selector in HTML.

        // Pricing
        document.querySelector('#pricing-section h2').textContent = text.pricingTitle;
        document.querySelector('#pricing-section p.text-lg').textContent = text.pricingSubtitle;

        // Tracker Section
        document.getElementById('tracker-title').textContent = text.trackerTitle;
        document.getElementById('tracker-subtitle').textContent = text.trackerSubtitle;
        jobIdInput.placeholder = text.statusInputPlaceholder;
        document.getElementById('track-button').textContent = text.trackButton;

        // Footer
        document.getElementById('admin-link').textContent = text.adminLink;
        document.querySelector('footer a[href^="mailto"]').textContent = text.contact;

        // Chat Box Header
        chatHeaderTitle.textContent = text.chatHeader;


        // The workers list will be re-rendered by the fetch or filter actions.

        // Update the toggle button text
        languageToggle.textContent = lang === 'EN' ? 'HI / EN' : 'हिंदी / अंग्रेज़ी';

        // Store language preference
        localStorage.setItem('language', lang);
        currentLanguage = lang;
        lucide.createIcons(); // Re-render icons after text changes
    }

    languageToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'EN' ? 'HI' : 'EN';
        applyLanguage(newLang);
    });

    // Load initial language
    const savedLanguage = localStorage.getItem('language') || 'EN';
    applyLanguage(savedLanguage);


    // 9. Event listener for the filter form submission
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Do not filter if the main worker data hasn't been loaded yet.
        if (MOCK_WORKERS.length === 0) {
            showNotification("Still loading worker data, please try again in a moment.");
            return;
        }

        // Get filter values and normalize to lowercase for search
        const skillQuery = skillInput.value.trim().toLowerCase();
        const locationQuery = locationSelect.value.trim().toLowerCase();

        // Filter the mock data
        const filteredWorkers = MOCK_WORKERS.filter(worker => {
            const matchesSkill = skillQuery === "" || worker.skill.toLowerCase().includes(skillQuery);
            const matchesLocation = locationQuery === "" || worker.location.toLowerCase() === locationQuery;
            return matchesSkill && matchesLocation;
        });

        // Re-render the list with filtered results
        renderWorkers(filteredWorkers);
    });

    // 10. Function to generate the HTML for a single worker card (Worker Profiles)
    function createWorkerCardHTML(worker) {
        const text = TEXT_CONTENT[currentLanguage];

        // Star rating visualization (Ratings & Reviews)
        const totalStars = 5;
        let starHTML = '';
        const filledStar = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star inline-block"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        const emptyStar = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star inline-block"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

        // Create the star visualization
        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.round(worker.rating)) {
                starHTML += filledStar;
            } else {
                starHTML += emptyStar;
            }
        }


        // Verified badge (Verified Employers - implied worker verification)
        const verifiedBadge = worker.verified ?
            `<span class="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium ml-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                Verified
            </span>` : '';

        return `
            <li class="bg-white p-5 rounded-xl shadow-lg border-t-4 border-primary hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div class="flex items-start justify-between mb-3">
                    <h4 class="text-xl font-bold text-gray-800 dark:text-white">${worker.name}</h4>
                    <div class="flex flex-col items-end">
                        <div class="flex items-center text-sm font-semibold text-secondary-dark">
                            ${starHTML}
                        </div>
                        <p class="text-xs text-gray-500">(${worker.reviewsCount} Reviews)</p>
                    </div>
                </div>
                
                <p class="text-base text-gray-700 font-medium mb-1 dark:text-gray-300">${worker.skill} ${verifiedBadge}</p>
                <p class="text-sm text-gray-500 mb-4">
                    Experience: ${worker.experience} | Location: <span class="font-semibold">${worker.location}</span>
                </p>

                <!-- Action Buttons (Direct Communication Mockup) -->
                <div class="flex space-x-3 mt-4">
                    <button onclick="simulateChat(${worker.id})" class="flex-1 bg-primary text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-dark transition">
                        <i data-lucide="message-square-text" class="inline-block w-4 h-4 mr-1"></i> ${text.chatNow}
                    </button>
                    <button onclick="simulateCall(${worker.id})" class="flex-1 bg-gray-200 text-gray-800 text-sm font-semibold py-2 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                        <i data-lucide="phone" class="inline-block w-4 h-4 mr-1"></i> ${text.call}
                    </button>
                </div>
            </li>
        `;
    }

    // 11. Function to render the list of workers
    function renderWorkers(workers) {
        workersContainer.innerHTML = ''; // Clear previous listings

        if (workers.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            workers.forEach(worker => {
                workersContainer.innerHTML += createWorkerCardHTML(worker);
            });
            // Initialize Lucide icons after adding HTML
            lucide.createIcons();
        }
    }

    // 12. Mockup Functions for Direct Communication
    window.simulateChat = function (workerId) {
        const worker = MOCK_WORKERS.find(w => w.id === workerId);
        console.log(`Simulating chat initiation with Worker ID ${workerId}: ${worker.name}`);
        showNotification(`Opening chat with ${worker.name}... (Feature requires Employer Access subscription)`);
    }

    window.simulateCall = function (workerId) {
        const worker = MOCK_WORKERS.find(w => w.id === workerId);
        console.log(`Simulating call initiation with Worker ID ${workerId}: ${worker.name}`);
        showNotification(`Dialing ${worker.name}... (Feature requires Employer Access subscription)`);
    }

    // 13. Track Status Feature Logic
    trackButton.addEventListener('click', () => {
        const jobId = jobIdInput.value.trim().toUpperCase();
        const resultDiv = document.getElementById('status-result');

        if (!jobId) {
            showNotification("Please enter a valid Job ID.");
            resultDiv.classList.add('hidden');
            return;
        }

        fetch(`http://localhost:8000/jobs/${jobId}`)
            .then(response => response.json())
            .then(data => {
                if(data.data){
                    let statusMessage = data.data.message;
                    let statusClass;
                    let icon;

                    if (data.data.status === 'ACCEPTED') {
                        statusClass = 'bg-green-100 text-green-800 border-green-400 dark:bg-green-800 dark:text-green-200';
                        icon = 'truck';
                    } else if (data.data.status === 'PENDING') {
                        statusClass = 'bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-800 dark:text-yellow-200';
                        icon = 'clock';
                    } else {
                        statusMessage = `Job ID ${jobId}: Status NOT FOUND. Please check the ID or contact support.`;
                        statusClass = 'bg-red-100 text-red-800 border-red-400 dark:bg-red-800 dark:text-red-200';
                        icon = 'x-octagon';
                    }

                    resultDiv.innerHTML = `
                        <div class="flex items-center space-x-3 border-l-4 p-3 ${statusClass}">
                            <i data-lucide="${icon}" class="w-6 h-6 flex-shrink-0"></i>
                            <p class="font-semibold">${statusMessage}</p>
                        </div>
                    `;
                    resultDiv.classList.remove('hidden');
                    lucide.createIcons();
                    showNotification(`Status for ${jobId} retrieved.`);
                } else {
                    let statusMessage = `Job ID ${jobId}: Status NOT FOUND. Please check the ID or contact support.`;
                    let statusClass = 'bg-red-100 text-red-800 border-red-400 dark:bg-red-800 dark:text-red-200';
                    let icon = 'x-octagon';
                    resultDiv.innerHTML = `
                        <div class="flex items-center space-x-3 border-l-4 p-3 ${statusClass}">
                            <i data-lucide="${icon}" class="w-6 h-6 flex-shrink-0"></i>
                            <p class="font-semibold">${statusMessage}</p>
                        </div>
                    `;
                    resultDiv.classList.remove('hidden');
                    lucide.createIcons();
                    showNotification(`Status for ${jobId} not found.`);
                }
            });
    });


    // 14. Simple Notification/Message Box (Replaces alert())
    window.showNotification = function (message) {
        const notificationId = 'app-notification';
        let notification = document.getElementById(notificationId);

        if (!notification) {
            notification = document.createElement('div');
            notification.id = notificationId;
            // Ensure this notification looks good in both themes
            notification.className = 'fixed bottom-5 right-5 z-50 p-4 bg-indigo-600 text-white rounded-lg shadow-xl transition-all duration-300 transform opacity-0 translate-y-full';
            document.body.appendChild(notification);
        }

        notification.textContent = message;

        // Show the notification
        notification.classList.remove('opacity-0', 'translate-y-full');

        // Hide after 3 seconds
        clearTimeout(notification.timer);
        notification.timer = setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-y-full');
        }, 3000);
    }

    // 15. Payment Logic
    const paymentPlans = {
        basic: { amount: 49, name: 'Basic Access' },
        premium: { amount: 99, name: 'Premium Verified' },
        enterprise: { amount: 499, name: 'Factory/Enterprise' }
    };

    document.getElementById('subscribe-basic').onclick = function() { initiatePayment('basic'); };
    document.getElementById('subscribe-premium').onclick = function() { initiatePayment('premium'); };
    document.getElementById('subscribe-enterprise').onclick = function() { initiatePayment('enterprise'); };

    async function initiatePayment(plan) {
        console.log('initiatePayment called with plan:', plan);
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User object from localStorage:', user);

        if (!user) {
            showNotification('Please login to subscribe.');
            window.location.href = 'login.html';
            return;
        }

        console.log('Redirecting to payment.html...');
        window.location.href = `payment.html?plan=${plan}`;
    }
});