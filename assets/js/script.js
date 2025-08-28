$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // contact form submission with FormSubmit
    const showToast = (message, type = 'success') => {
        let toast = document.getElementById('form-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'form-toast';
            document.body.appendChild(toast);
        }
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    };

    $("#contact-form").on('submit', async function (event) {
        event.preventDefault();

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).css('opacity', 0.7);

        try {
            const name = $(this).find('[name="name"]').val();
            const email = $(this).find('[name="email"]').val();
            const message = $(this).find('[name="message"]').val();

            // Basic validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
            if (!name || !email || !message) {
                throw new Error('Please fill out all fields.');
            }
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address.');
            }

            // Use FormData per FormSubmit requirements
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            formData.append('_captcha', 'false');
            formData.append('_subject', 'New message from portfolio');
            formData.append('_template', 'table');
            // ensure replies go to the user's email and send them an auto-response
            formData.append('_replyto', email);
            formData.append('_autoresponse', 'Hi ' + name + ',\n\nThanks for reaching out! I have received your message and will get back to you soon.\n\nRegards,\nAdarsh Rai');
            formData.append('_autoresponse_subject', 'We received your message');

            const response = await fetch('https://formsubmit.co/ajax/8f664654635bb76bee11b0142a458a6d', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const resJson = await response.json();
            if (!resJson.success && resJson.success !== 'true') throw new Error('FormSubmit error');

            this.reset();
            showToast('Message submitted successfully!', 'success');
        } catch (error) {
            console.log('FAILED...', error);
            showToast(error.message || 'Submission failed. Please try again.', 'error');
        } finally {
            submitBtn.prop('disabled', false).css('opacity', 1);
        }
    });
    // contact form submission end

    // Dark mode toggle logic
    const darkToggle = document.getElementById('dark-mode-toggle');
    const icon = darkToggle && darkToggle.querySelector('i');
    function setDarkMode(on) {
        document.body.classList.toggle('dark-mode', on);
        if(icon) icon.className = on ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkMode', on ? '1' : '0');
    }
    function updateParticlesForTheme() {
      const isDark = document.body.classList.contains('dark-mode');
      const color = isDark ? '#ffd580' : '#002057';
      if(window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.particles.line_linked.color = color;
        window.pJSDom[0].pJS.particles.line_linked.opacity = 0.4;
        window.pJSDom[0].pJS.particles.color.value = color;
        window.pJSDom[0].pJS.fn.particlesRefresh();
      }
    }
    if(darkToggle) {
        darkToggle.addEventListener('click', function() {
            setDarkMode(!document.body.classList.contains('dark-mode'));
            setTimeout(updateParticlesForTheme, 100);
        });
    }
    // Restore mode on load
  // Restore mode on load (Dark mode default rakho)
if(localStorage.getItem('darkMode') !== '0') {
    setDarkMode(true);   // Default = Dark Mode
} else {
    setDarkMode(false);
}
setTimeout(updateParticlesForTheme, 300);

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Adarsh Portfolio";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).forEach(project => {
        // Handle image path properly with fallback
        const imageUrl = project.image ? `./assets/images/projects/${project.image}.png` : './assets/images/projects/default.png';
        
        projectHTML += `
        <div class="box tilt">
      <img draggable="false" src="${imageUrl}" alt="${project.name}" onerror="this.src='./assets/images/projects/default.png'" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// ============== AI CHATBOT (local, rule-based) ==============
window.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('ai-chat-button');
    const panel = document.getElementById('ai-chat-panel');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    const messages = document.getElementById('ai-chat-messages');
    const suggestions = document.getElementById('ai-chat-suggestions');
    const closeBtn = document.getElementById('ai-chat-close');
    const clearBtn = document.getElementById('ai-chat-clear');
    if(!btn || !panel) return;

    // Tooltip for chatbot button
    if(btn && !btn.querySelector('.chat-tooltip')){
        const tooltip = document.createElement('div');
        tooltip.className = 'chat-tooltip';
        tooltip.innerText = 'Chat with the bot!';
        btn.appendChild(tooltip);
    }

    const profile = {
        name: 'Adarsh Rai',
        email: 'adarshrai410@gmail.com',
        phone: '+91 706-121-5898',
        location: 'Sasaram, India',
        skills: (window.__skillsCache || []),
        projects: []
    };

    function addMessage(text, who = 'bot') {
        const msg = document.createElement('div');
        msg.className = 'msg ' + who;
        msg.innerHTML = text;
        messages.appendChild(msg);
        // Scroll to bottom after adding message
        messages.scrollTop = messages.scrollHeight;
    }

    function navigateTo(section){
        const map = {
            home: '#home',
            about: '#about',
            skills: '#skills',
            education: '#education',
            work: '#work',
            projects: '/projects',
            experience: '#experience',
            contact: '#contact'
        };
        const target = map[section];
        if(!target) return false;
        if(target.startsWith('#')){
            const el = document.querySelector(target);
            if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); return true; }
        } else {
            window.location.href = target; return true;
        }
        return false;
    }

    function answer(q){
        const query = q.toLowerCase();
        // Enhanced greetings with more variations and responsive replies
        const greetings = [
            "hi", "hello", "hey", "hii", "hiii", "helo", "hellow", "heya", "howdy",
            "good morning", "good afternoon", "good evening", "good night",
            "jaishree ram", "jai mata de", "namaste", "namaskar", "pranaam",
            "what's up", "whats up", "wassup", "sup", "yo", "hola"
        ];
        
        if(greetings.some(greet => query.includes(greet))){
            const responses = [
                "🙏 Jai Shree Ram! How can I help you today?",
                "🙏 Namaste! Welcome to my portfolio. What would you like to know?",
                "👋 Hello there! I'm here to help you learn about Adarsh. What interests you?",
                "🌟 Hey! Great to see you here. Ask me anything about skills, projects, or experience!",
                "✨ Hi! I'm Adarsh's AI assistant. How can I assist you today?",
                "🚀 Hello! Ready to explore my portfolio? What would you like to discover?"
            ];
            
            // Time-based greetings
            const hour = new Date().getHours();
            if(query.includes('morning') || (hour >= 5 && hour < 12)){
                return "🌅 Good morning! Hope you're having a great start to your day. How can I help you explore my portfolio?";
            } else if(query.includes('afternoon') || (hour >= 12 && hour < 17)){
                return "☀️ Good afternoon! Thanks for visiting my portfolio. What would you like to know about me?";
            } else if(query.includes('evening') || (hour >= 17 && hour < 21)){
                return "🌆 Good evening! Welcome to my portfolio. How can I assist you today?";
            } else if(query.includes('night') || hour >= 21 || hour < 5){
                return "🌙 Good night! Thanks for the late visit. What brings you to my portfolio?";
            }
            
            // Religious greetings
            if(query.includes('jaishree') || query.includes('jai mata')){
                return "🙏 Jai Shree Ram! Blessed to have you here. How can I help you today?";
            }
            if(query.includes('namaste') || query.includes('namaskar') || query.includes('pranaam')){
                return "🙏 Namaste! Welcome to my digital space. What would you like to explore?";
            }
            
            // Casual greetings
            if(query.includes('what\'s up') || query.includes('whats up') || query.includes('wassup') || query.includes('sup')){
                return "🤘 Not much, just here to help you learn about Adarsh! What's up with you? What can I tell you about?";
            }
            
            // Return random response for generic greetings
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // navigation intents
        if(query.includes('go to') || query.includes('navigate') || query.includes('open ')){
            const sections = ['home','about','skills','education','work','projects','experience','contact'];
            for(const s of sections){
                if(query.includes(s)){
                    const ok = navigateTo(s);
                    return ok ? `Navigating to ${s}...` : `Could not navigate to ${s}.`;
                }
            }
        }
        // Personal introduction and details
        if(query.includes('who are you') || query.includes('about you') || query.includes('introduce') || query.includes('yourself') || query.includes('adarsh')){
            return `**Adarsh Rai**\n\nI'm a passionate Full-Stack Developer based in Sasaram, India. I specialize in building modern web applications and mobile apps using cutting-edge technologies.\n\n**About Me:**\n• Currently pursuing B.Tech in Computer Science at IIIT Bhagalpur\n• Passionate about creating innovative solutions and improving user experiences\n• Love building Full-Stack clones and exploring new technologies\n• Working on iOS development with Flutter and web development with MERN stack\n\n**Current Focus:**\n• Software Development Intern at Hushh.ai (iOS/Flutter)\n• Previously interned at Bluestock Fintech (Web Development)\n• Building responsive web applications and mobile apps\n\n**Contact:** ${profile.email} | ${profile.phone}`;
        }
        if(query.includes('email')) return `You can reach Adarsh at ${profile.email}`;
        if(query.includes('phone')||query.includes('contact')) return `Phone: ${profile.phone}. Email: ${profile.email}`;
        if(query.includes('location')||query.includes('based')) return `Based in ${profile.location}`;
        if(query.includes('skill')){
            const names = (profile.skills||[]).map(s=>s.name).join(', ');
            return names ? `Skills: ${names}` : 'Skills will load shortly. Please scroll once to load them.';
        }
        // Enhanced project handling
        if(query.includes('project') || query.includes('algosync') || query.includes('cyberverse') || query.includes('reachbox') || query.includes('restaurant') || query.includes('laundry') || query.includes('react')){
            if(!profile.projects || !profile.projects.length){
                return 'Check the Projects section for details and links (View/Code).';
            }
            
            // Check for specific project queries
            const projectNames = profile.projects.map(p => p.name.toLowerCase());
            const queryWords = query.split(' ');
            
            // Find specific project
            let specificProject = null;
            for(const project of profile.projects){
                if(queryWords.some(word => project.name.toLowerCase().includes(word))){
                    specificProject = project;
                    break;
                }
            }
            
            // If asking about a specific project
            if(specificProject){
                let response = `**${specificProject.name}**\n\n`;
                if(specificProject.desc) response += `**Description:** ${specificProject.desc}\n\n`;
                if(specificProject.links?.view) response += `**Live Demo:** ${specificProject.links.view}\n`;
                if(specificProject.links?.code) response += `**Source Code:** ${specificProject.links.code}`;
                return response;
            }
            
            // If asking for links specifically
            if(query.includes('link') || query.includes('demo') || query.includes('live')){
                const links = profile.projects.map(p => 
                    `• **${p.name}**\n  Demo: ${p.links?.view || 'N/A'}\n  Code: ${p.links?.code || 'N/A'}`
                ).join('\n\n');
                return `**Project Links:**\n\n${links}`;
            }
            
            // If asking for descriptions
            if(query.includes('desc') || query.includes('what') || query.includes('about')){
                const descriptions = profile.projects.map(p => 
                    `• **${p.name}**\n  ${p.desc || 'Description not available'}`
                ).join('\n\n');
                return `**Project Descriptions:**\n\n${descriptions}`;
            }
            
            // Default: show project names with brief info
            const projectList = profile.projects.map(p => 
                `• **${p.name}** - ${p.desc ? p.desc.substring(0, 60) + '...' : 'Click to view details'}`
            ).join('\n');
            return `**Projects:**\n\n${projectList}\n\n*Ask for specific project details, links, or descriptions!*`;
        }
        if(query.includes('experience')) return 'Recent experience: Hushh.ai (Software Development Intern), Bluestock Fintech (Software Development Intern).';
        if(query.includes('education')) return 'B.Tech CSE at IIIT Bhagalpur (2020–2026).';
        if(query.includes('resume') || query.includes('cv')) {
            return `You can view or download my resume here: <a href="https://drive.google.com/file/d/130-uu1ZJf4r65aIByr_Yoz1SNZvayxhp/view?usp=share_link" target="_blank"><strong>Resume (PDF)</strong></a>`;
        }
        if(query.includes('go to resume') || query.includes('resume section')) {
            navigateTo('about');
            setTimeout(() => {
                const resumeBtn = document.querySelector('.resumebtn .btn');
                if(resumeBtn) {
                    resumeBtn.classList.add('ai-highlight');
                    setTimeout(()=>resumeBtn.classList.remove('ai-highlight'), 2000);
                }
            }, 600);
            return 'Navigated to the Resume section for you!';
        }
        return 'I can answer about skills, projects, experience, education, and contact info. Try asking: "What are your skills?"';
    }

    btn.addEventListener('click',()=>{
        const opening = !panel.classList.contains('ai-open');
        panel.classList.toggle('ai-open');
        if(opening) { 
            setTimeout(()=>input && input.focus(), 0);
            // Add typing indicator
            setTimeout(() => {
                // Remove the initial addMessage call for the welcome message
            }, 300);
        }
    });
    sendBtn&&sendBtn.addEventListener('click',()=>{
        const val = (input.value||'').trim();
        if(!val) return;
        addMessage(val,'me');
        const reply = answer(val);
        addMessage(reply,'bot');
        input.value='';
        input.focus();
    });
    closeBtn&&closeBtn.addEventListener('click',()=>{ panel.classList.remove('ai-open'); });
    clearBtn&&clearBtn.addEventListener('click',()=>{ 
        messages.innerHTML = '';
        // Add welcome message back after clearing
        setTimeout(() => {
            // Remove the initial addMessage call for the welcome message
        }, 300);
    });
    input&&input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); sendBtn.click(); }});

    function renderSuggestions(){
        if(!suggestions) return;
        suggestions.innerHTML = '';
        const items = [
            'About Adarsh',
            'Show skills',
            'List projects', 
            'Project links',
            'Project descriptions',
            'Experience',
            'Education',
            'Contact'
        ];
        items.forEach(t=>{
            const b = document.createElement('button');
            b.textContent = t; b.addEventListener('click',()=>{ input.value = t; sendBtn.click(); });
            suggestions.appendChild(b);
        });
    }

    // Load skills and projects for richer answers
    fetchData('skills').then(data=>{ window.__skillsCache = data; profile.skills = data; });
    fetch('./projects/projects.json').then(r=>r.json()).then(p=>{ profile.projects = p || []; });
    renderSuggestions();
});
// ============================================================

// removed Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .telegram', { interval: 600 });

// Added for Competitive Programming Profiles
srtop.reveal('.home .leetcode', { interval: 800 });
srtop.reveal('.home .codeforces', { interval: 1000 });
srtop.reveal('.home .gfg', { interval: 1200 });


/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });
