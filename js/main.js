//nav linkovi
const navLinks = [
    { text: "Home", href: "index.html" },
    { text: "About", href: "index.html#about" },
    { text: "Cars", href: "index.html#cars-container" },
    { text: "Contact", href: "contact.html" },
    { text: "Author", href: "author.html" },
    { icon: "fa-regular fa-file-lines", href: "dokumentacija.pdf" },
    { icon: "fa-solid fa-download", href: "porsche.zip" }
];

//wec kola
const cars = [
    {
        image: "img/car4.png",
        number: "#4",
        alt: "#4",
        team: "Porsche Penske Motorsport",
        category: "Hypercar",
        cubeColor: "#e21e19"
    },
    {
        image: "img/car5.png",
        number: "#5",
        alt: "#5",
        team: "Porsche Penske Motorsport",
        category: "Hypercar",
        cubeColor: "#e21e19"
    },
    {
        image: "img/car6.png",
        number: "#6",
        alt: "#6",
        team: "Porsche Penske Motorsport",
        category: "Hypercar",
        cubeColor: "#e21e19"
    },
    {
        image: "img/car99.png",
        number: "#99",
        alt: "#99",
        team: "Porsche Penske Motorsport",
        category: "Hypercar",
        cubeColor: "#e21e19"
    },
    {
        image: "img/car92.png",
        number: "#92",
        alt: "#92",
        team: "Porsche Penske Motorsport",
        category: "LMGT3",
        cubeColor: "#009639"
    },
    {
        image: "img/car85.png",
        number: "#85",
        alt: "#85",
        team: "Porsche Penske Motorsport",
        category: "LMGT3",
        cubeColor: "#009639"
    }
];

//footer linkovi
const footerLinks = [
    { text: "Home", href: "index.html" },
    { text: "About", href: "index.html#about" },
    { text: "Cars", href: "index.html#cars-container" },
    { text: "Contact", href: "contact.html" },
    { text: "Author", href: "author.html" }
];

//footer kontakt sekcija
const footerContact = [
    { icon: "fa fa-phone", text: "+381 631284792" },
    { icon: "fa fa-envelope", text: "contact@porsche.de" },
    { icon: "fa-regular fa-compass", text: "Zdravka Celara 8, Belgrade, Serbia" }
];

//footer socijalne mreze sekcija
const socialLinks = [
    { icon: "fa-brands fa-instagram", href: "https://www.instagram.com" },
    { icon: "fa-brands fa-youtube", href: "https://www.youtube.com" },
    { icon: "fa-brands fa-github", href: "https://github.com" }
];

//carousel slike
const carouselImg = [
    {
        image: "img/all-cars.jpg",
        slogan1: "Driven by Dreams",
        slogan2: "Porsche Motorsport #Raceborn"
    },
    {
        image: "img/side-track.jpg",
        slogan1: "#Speed",
        slogan2: "2 WEC Manufacturer titles"
    },
    {
        image: "img/side-track2.jpg",
        slogan1: "680 horsepower",
        slogan2: "Over 320 km/h"
    }
];

//Hamburger meni zatvara se kad se klikne na link
const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector(".navbar-nav");
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navBar.classList.toggle("active");
});
navBar.addEventListener("click", (ham) => {
    if (ham.target.closest(".nav-item")) {
        hamburger.classList.remove("active");
        navBar.classList.remove("active");
    }
});

//gledamo viewport da li je u sekciji cars/about da bi stavili thispage da promeni boju za hamburger meni dafault stavlja se na home
function Hamburgerview() {
    const carsContainer = document.getElementById("cars-container");
    const aboutSection = document.getElementById("about");
    if (!carsContainer && !aboutSection) return;

    const observer = new IntersectionObserver((viewport) => {
        const navItems = document.querySelectorAll(".navbar-nav .nav-item");
        let homeItem = null;
        let carsItem = null;
        let aboutItem = null;

        navItems.forEach(item => {
            const link = item.querySelector(".nav-link");
            if (link && link.textContent.trim() === "Home") homeItem = item;
            if (link && link.textContent.trim() === "Cars") carsItem = item;
            if (link && link.textContent.trim() === "About") aboutItem = item;
        });

        if (!homeItem) return;

        viewport.forEach(entry => {
            if (entry.isIntersecting) {
                homeItem.classList.remove("thispage");
                if (carsItem) carsItem.classList.remove("thispage");
                if (aboutItem) aboutItem.classList.remove("thispage");

                if (entry.target.id === "cars-container" && carsItem) {
                    carsItem.classList.add("thispage");
                } else if (entry.target.id === "about" && aboutItem) {
                    aboutItem.classList.add("thispage");
                }
            } else {
                if (entry.target.id === "cars-container" && carsItem) {
                    carsItem.classList.remove("thispage");
                }
                if (entry.target.id === "about" && aboutItem) {
                    aboutItem.classList.remove("thispage");
                }

                const carsVisible = carsItem && carsItem.classList.contains("thispage");
                const aboutVisible = aboutItem && aboutItem.classList.contains("thispage");
                if (!carsVisible && !aboutVisible) {
                    homeItem.classList.add("thispage");
                }
            }
        });
        //threshold 0.2 znaci 20% elementa u viewportu
    }, { threshold: 0.2 });

    if (carsContainer) observer.observe(carsContainer);
    if (aboutSection) observer.observe(aboutSection);
}
Hamburgerview();

//uzimamo trenutnu stranicu da stavimo active(this page) klasu u navu
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    return page;
}

//generisemo navigaciju
function generateNav() {
    const navBar = document.querySelector(".navbar-nav");
    if (!navBar) return;

    const currentPage = getCurrentPage();

    navBar.innerHTML = navLinks.map(link => {
        const isActive = link.text && link.href === currentPage;
        const content = link.text
            ? link.text
            : `<i class="${link.icon}"></i>`;
        return `
            <li class="nav-item${isActive ? ' thispage' : ''}">
                <a href="${link.href}" class="nav-link"${isActive ? ' aria-current="page"' : ''}>${content}</a>
            </li>
        `;
    }).join('');
}

//generisemo footer
function generateFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.innerHTML = `
        <div class="row justify-content-between">
            <!-- linkovi stranice -->
            <div class="col-8 col-md-5 mb-4">
                <h4 class="mb-3">Porsche Penske Motorsport</h4>
                <ul class="nav flex-column">
                    ${footerLinks.map(link => `
                        <li class="nav-item mb-4">
                            <a href="${link.href}" class="nav-link p-0">${link.text}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <!-- kontakt info -->
            <div class="col-8 col-md-5 mb-4">
                <h4 class="mb-3">Contact info</h4>
                <ul class="list-unstyled flex-column">
                    ${footerContact.map(item => `
                        <li class="mb-4">
                            <i class="${item.icon} me-2"></i> ${item.text}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        <!-- copy socijalne mreze -->
        <div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            <p>\u00A9 2026 All rights reserved.</p>
            <div class="social-icons d-flex gap-3 fs-4">
                ${socialLinks.map(link => `
                    <a href="${link.href}"><i class="${link.icon}"></i></a>
                `).join('')}
            </div>
        </div>
    `;
}
//generisemo automobile sa filterom
function generateCars(filter = "all") {
    const carsContainer = document.getElementById("cars-container");
    if (!carsContainer || cars.length === 0) return;

    //briem predhodni row da se ne duplicira beskonacno nakon klika na filter
    const Row = carsContainer.querySelector(".row");
    if (Row) Row.remove();

    const filtered = filter === "all" ? cars : cars.filter(car => car.category === filter);

    const row = document.createElement("div");
    row.className = "row";

    filtered.forEach(car => {
        const teamCard = document.createElement("div");
        teamCard.className = "col-12 col-md-6 mb-3";

        teamCard.innerHTML = `
            <div class="team-card pt-8">
                <div class="d-flex flex-column align-items-center p-4 p-lg-7 pb-lg-7 text-center position-relative border border-2 h-100">
                    <div class="d-flex flex-column align-items-center gap-2">
                        <div class="team-logo">
                            <img class="h-100 object-fit-contain" src="img/team-logo.png" alt="Porsche-logo">
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center gap-1 mb-3 mt-3">
                        <span class="p-1 z-3 cube"${car.cubeColor ? ` style="background-color: ${car.cubeColor}"` : ''}></span>
                        <span class="z-3 fs-11 fw-bold text-uppercase cube-text">${car.category}</span>
                    </div>
                    <h2 class="text-uppercase fw-bold fs-8 fs-lg-5 mb-5 mb-lg mt-auto">${car.team}</h2>
                    <img class="mb-5 mb-lg-7 team-car" src="${car.image}" alt="${car.alt}">
                    <span class="fs-9 fs-lg-8 fw-bold text-uppercase">${car.number}</span>
                </div>
            </div>
        `;

        row.appendChild(teamCard);
    });

    carsContainer.appendChild(row);
}

//animacija kartica kad se pojave u viewportu
function animateCars() {
    const Teamcards = document.querySelectorAll(".team-card");
    if (!Teamcards.length) return;

    const observer = new IntersectionObserver((viewport) => {
        viewport.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
        //threshold 0.15 znaci 15% elementa u viewportu
    }, { threshold: 0.15 });

    Teamcards.forEach(card => observer.observe(card));
}

//funkcije pozivamo da generisemo navigaciju, futer i kartice automobila kao i njihove animacije
generateNav();
generateFooter();
generateCars();
animateCars();

//filter klasa
const classFilter = document.getElementById("class-filter");
if (classFilter) {
    classFilter.addEventListener("change", () => {
        generateCars(classFilter.value);
        animateCars();
    });
}

//carousel menja svakih 5 sekundi
function Carousel() {
    const bg = document.querySelector(".background");
    const s1 = document.querySelector(".slogan1 h1");
    const s2 = document.querySelector(".slogan2 h1");
    if (!bg || !s1 || !s2 || carouselImg.length === 0) return;

    let current = 0;

    const slogan1Div = document.querySelector(".slogan1");
    const slogan2Div = document.querySelector(".slogan2");

    function showSlide(index) {
        bg.style.backgroundImage = `url('${carouselImg[index].image}')`;
        s1.textContent = carouselImg[index].slogan1;
        s2.textContent = carouselImg[index].slogan2;
    }

    function changeSlide() {
        slogan1Div.classList.add("fade-out");
        slogan2Div.classList.add("fade-out");

        setTimeout(() => {
            current = (current + 1) % carouselImg.length;
            showSlide(current);
            slogan1Div.classList.remove("fade-out");
            slogan2Div.classList.remove("fade-out");
        }, 600);
    }

    setInterval(changeSlide, 5000);
}
Carousel();

//funkcija validacija forme regex za validiranje
//blur event da se validacija pokrene kad korisnik izadje iz inputa
//input event da se greska skine cim korisnik pocne da kuca
function FormRegex() {
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const emailInput = document.getElementById("e-mail");
    const messageInput = document.getElementById("message");

    //ovo nam sluzi da vidimo da li elemnti forme postome u DOMU, ako ne vraca null i nece izbaciti gresku
    if (!nameInput || !surnameInput || !emailInput || !messageInput) return;

    const nameRegex = /^[A-Za-zČĆŽŠĐčćžšđ ]{1,20}$/;
    const surnameRegex = /^[A-Za-zČĆŽŠĐčćžšđ ]{1,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const messageRegex = /^.{20,250}$/s;

    function validate(input, regex, errorId, requiredMsg, exampleText) {
        const errorSpan = document.getElementById(errorId);

        input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
                input.classList.add("invalid");
                input.classList.remove("example");
                errorSpan.textContent = requiredMsg;
                errorSpan.className = "error";
            } else if (!regex.test(input.value.trim())) {
                input.classList.add("invalid");
                input.classList.remove("example");
                errorSpan.textContent = requiredMsg;
                errorSpan.className = "error";
            } else {
                input.classList.remove("invalid");
                errorSpan.textContent = "";
                errorSpan.className = "error";
            }
        });

        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.remove("invalid");
                if (exampleText) {
                    errorSpan.textContent = exampleText;
                    errorSpan.className = "example";
                } else {
                    errorSpan.textContent = "";
                    errorSpan.className = "error";
                }
            } else {
                errorSpan.textContent = "";
                errorSpan.className = "error";
            }
        });
    }

    //Message validacija ne prikazuje se dok korisnik ne krene da kuca za ostale nam ne treba
    //ocigledno se vidi sta treba uraditi sa form kontrolom dal input ili radio dugmici
    validate(nameInput, nameRegex, "nameError", "Name is required", "Example: Kevin");
    validate(surnameInput, surnameRegex, "surnameError", "Surname is required", "Example: Estre");
    validate(emailInput, emailRegex, "emailError", "Email is required", "Example: Kevinestre@gmail.com");

    
    const messageError = document.getElementById("messageError");

    //koristimo blur i input event za validaciju
    messageInput.addEventListener("blur", () => {
        const val = messageInput.value.trim();
        if (val === "") {
            messageInput.classList.add("invalid");
            messageError.textContent = "Message is required";
            messageError.className = "error";
        } else if (!messageRegex.test(val)) {
            messageInput.classList.add("invalid");
            messageError.textContent = "Message must be between 20-250 characters";
            messageError.className = "error";
        } else {
            messageInput.classList.remove("invalid");
            messageError.textContent = "";
            messageError.className = "error";
        }
    });

    messageInput.addEventListener("input", () => {
        const val = messageInput.value.trim();
        if (val !== "") {
            messageInput.classList.remove("invalid");
            if (val.length < 20 || val.length > 250) {
                messageError.textContent = "Message must be between 20-250 characters";
                messageError.className = "example";
            } else {
                messageError.textContent = "";
                messageError.className = "error";
            }
        } else {
            messageError.textContent = "";
            messageError.className = "error";
        }
    });
    
    //submit validacija kada se klikne na dugme submit ponovno se proveravaju svi uslovi iz regexa
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            let isValid = true;

            //ime greska
            const nameError = document.getElementById("nameError");
            if (nameInput.value.trim() === "" || !nameRegex.test(nameInput.value.trim())) {
                nameInput.classList.add("invalid");
                nameError.textContent = "Name is required";
                nameError.className = "error";
                isValid = false;
            }

            //prezime greska
            const surnameError = document.getElementById("surnameError");
            if (surnameInput.value.trim() === "" || !surnameRegex.test(surnameInput.value.trim())) {
                surnameInput.classList.add("invalid");
                surnameError.textContent = "Surname is required";
                surnameError.className = "error";
                isValid = false;
            }

            //email greska
            const emailError = document.getElementById("emailError");
            if (emailInput.value.trim() === "" || !emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add("invalid");
                emailError.textContent = "Email is required";
                emailError.className = "error";
                isValid = false;
            }

            //message greska
            const message = messageInput.value.trim();
            if (message === "") {
                messageInput.classList.add("invalid");
                messageError.textContent = "Message is required";
                messageError.className = "error";
                isValid = false;
            } else if (!messageRegex.test(message)) {
                messageInput.classList.add("invalid");
                messageError.textContent = "Message must be between 20-250 characters";
                messageError.className = "error";
                isValid = false;
            }

            //select/option greska
            const selectInput = document.getElementById("table-teams");
            const selectError = document.getElementById("selectError");
            if (!selectInput.value) {
                selectInput.classList.add("invalid");
                selectError.textContent = "Must select a team";
                selectError.className = "error";
                isValid = false;
            } else {
                selectInput.classList.remove("invalid");
                selectError.textContent = "";
            }

            //radio buttons greska
            const radioError = document.getElementById("radioError");
            const radioChecked = document.querySelector('input[name="wec"]:checked');
            if (!radioChecked) {
                radioError.textContent = "Must select an option";
                radioError.className = "error";
                isValid = false;
            } else {
                radioError.textContent = "";
            }

            //prevent dafault da ne resetuje stranicu
            //reset da bi obrisao podatke nakon klika i imamo popup poslata poruka nakon toga ako sve prodje
            if (!isValid) {
                e.preventDefault();
            } else {
                e.preventDefault();
                form.reset();
                document.querySelectorAll(".error, .example").forEach(el => el.textContent = "");
                
                const formmsg = document.createElement("div");
                formmsg.className = "form-message";
                formmsg.textContent = "Message sent";
                document.body.appendChild(formmsg);

                //koristim ove dve set funkcije iz native js-a da pripremim browser za animaciju, a settimeout da krene nakon zadatog vremena
                requestAnimationFrame(() => {
                    formmsg.classList.add("show");
                });

                setTimeout(() => {
                    formmsg.classList.remove("show");
                    setTimeout(() => formmsg.remove(), 500);
                }, 3000);
            }
        });
    }
}
FormRegex();