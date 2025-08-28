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
    });
});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Adarsh Portfolio";
            $("#favicon").attr("href", "/assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "/assets/images/favhand.png");
        }
    });


// fetch projects start
async function getProjects() {
    try {
        const response = await fetch('./projects.json');
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to embedded data if fetch fails
        return [
            {
                "name": "AlgoSync",
                "desc": "Collaborative real-time code editor supporting 50+ users with live synchronization, chat, drawing, and AI-powered code suggestions. Optimized backend with Node.js, Express.js, and Socket.io to handle 10,000+ connections.",
                "image": "abgosync",
                "links": {
                    "view": "https://algo-sync-theta.vercel.app/",
                    "code": "https://github.com/adarsh06261/AlgoSync"
                }
            },
            {
                "name": "Cyberverse",
                "desc": "Frontend project to showcase UI skills with interactive design using JavaScript and CSS. Deployed on Vercel.",
                "image": "Screenshot 2025-08-27 at 9.49.32 PM",
                "links": {
                    "view": "https://cyberverse-vert.vercel.app/",
                    "code": "https://github.com/adarsh06261/cyberverse"
                }
            },
            {
                "name": "ReachBox",
                "desc": "Frontend application developed using React, TypeScript, and Tailwind CSS, created as part of an assignment for Reachinbox.",
                "image": "reachbox",
                "links": {
                    "view": "https://reachinbox-frontend.netlify.app",
                    "code": "https://github.com/adarsh06261/ReachInBox"
                }
            },
            {
                "name": "Restaurant",
                "desc": "A UI/UX design concept for a restaurant mobile application, showcasing a modern and user-friendly interface.",
                "image": "restaurant",
                "links": {
                    "view": "https://www.behance.net/gallery/130041127/Restaurant-App-UI-Design",
                    "code": "https://github.com/adarsh06261/RestaurantApp"
                }
            },
            {
                "name": "Laundry Services",
                "desc": "An on-demand laundry service app concept, featuring a user-friendly interface for booking and managing laundry services.",
                "image": "restaurant",
                "links": {
                    "view": "https://dribbble.com/shots/15969440-Laundry-Service-App-UI",
                    "code": "https://github.com/adarsh06261/LaundryServicesApp"
                }
            },
            {
                "name": "Basic React App",
                "desc": "A basic React application used to demonstrate fundamental concepts in React and JSX.",
                "image": "my-basic-react app",
                "links": {
                    "view": "https://basicreactapp.netlify.app",
                    "code": "https://github.com/adarsh06261/BasicReactApp"
                }
            }
        ];
    }
}

function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";
    projects.forEach(project => {
        // Handle missing images gracefully with proper relative path
        const imageUrl = project.image ? `../assets/images/projects/${project.image}.png` : '../assets/images/projects/default.png';
        
        projectsHTML += `
        <div class="box tilt">
      <img draggable="false" src="${imageUrl}" alt="${project.name}" onerror="this.src='../assets/images/projects/default.png'" />
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
    projectsContainer.innerHTML = projectsHTML;

    // Initialize VanillaTilt for better UX
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.tilt'), { 
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // Initialize ScrollReveal for animations
    if (typeof ScrollReveal !== 'undefined') {
        const srtop = ScrollReveal({
            origin: 'top',
            distance: '80px',
            duration: 1000,
            reset: true
        });
        srtop.reveal('.work .box', { interval: 200 });
    }
}

// Load projects when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    getProjects().then(data => {
        showProjects(data);
    }).catch(error => {
        console.error('Error loading projects:', error);
        // Fallback: show a message if projects fail to load
        document.querySelector(".work .box-container").innerHTML = 
            '<div style="text-align: center; color: #fff; font-size: 1.8rem; padding: 2rem;">Projects are currently unavailable. Please try again later.</div>';
    });
});
// fetch projects end

// removed Tawk.to Live Chat

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
