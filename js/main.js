//Promenljive za podatke
let navLinks = [];
let cars = [];
let footerLinks = [];
let footerContact = [];
let socialLinks = [];
let carouselImg = [];

//ajax callback
function loadJSONData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/data.json", true);
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            navLinks = data.navLinks;
            cars = data.cars;
            footerLinks = data.footerLinks;
            footerContact = data.footerContact;
            socialLinks = data.socialLinks;
            carouselImg = data.carouselImg;
            
            //pozivamo funkcije za generisanje
            generateNav();
            generateFooter();
            
            const initialClass = classFilter ? classFilter.value : "all";
            const initialSponsor = sponsorFilter ? sponsorFilter.value : "all";
            const initialSort = sortFilter ? sortFilter.value : "all";
            
            generateCars(initialClass, initialSponsor, initialSort, true);
            if (classFilter && sponsorFilter) updateFilterOptions();
            animateCars();
            Carousel();
        }
    };
    xhr.send();
}

//pozivamo ajax i ucitavamo podatke
loadJSONData();

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
let currentVisibleCars = 2; //koliko inicijalno prikazujemo automobila

//generisemo automobile sa filterom
function generateCars(classFilterVal = "all", sponsorFilterVal = "all", sortFilterVal = "all", reset = true) {
    const carsContainer = document.getElementById("cars-container");
    if (!carsContainer || cars.length === 0) return;

    if (reset) {
        currentVisibleCars = 2;
    }

    let filtered = cars.filter(car => {
        const classMatch = classFilterVal === "all" || car.category === classFilterVal;
        
        let sponsorMatch = sponsorFilterVal === "all";
        if (!sponsorMatch && car.sponsor) {
            //sponsor mapiranje
            const sponsorMap = {
                "michelin": "Michelin",
                "mobil1": "Mobil 1",
                "tagheuer": "Tag Heuer",
                "fat": "F.A.T. International",
                "goodyear": "Goodyear",
                "weathertech": "WeatherTech"
            };
            const exactSponsor = sponsorMap[sponsorFilterVal.toLowerCase()];
            if (exactSponsor && Array.isArray(car.sponsor)) {
                sponsorMatch = car.sponsor.includes(exactSponsor);
            } else if (exactSponsor) {
                sponsorMatch = car.sponsor === exactSponsor;
            }
        }
        
        return classMatch && sponsorMatch;
    });

    if (sortFilterVal === "podiumsDesc") {
        filtered = filtered.sort((a, b) => b.podiums - a.podiums);
    } else if (sortFilterVal === "podiumsAsc") {
        filtered = filtered.sort((a, b) => a.podiums - b.podiums);
    } else if (sortFilterVal === "topSpeedDesc") {
        filtered = filtered.sort((a, b) => b.topSpeed - a.topSpeed);
    } else if (sortFilterVal === "topSpeedAsc") {
        filtered = filtered.sort((a, b) => a.topSpeed - b.topSpeed);
    }
    
    const visibleCars = reset ? filtered.slice(0, currentVisibleCars) : filtered.slice(currentVisibleCars - 2, currentVisibleCars);

    let row = carsContainer.querySelector(".row");
    
    if (reset) {
        if (row) row.remove();
        
        row = document.createElement("div");
        row.className = "row";
        carsContainer.appendChild(row);
    }

    const existingLoadMore = document.getElementById("load-more-container");
    if (existingLoadMore) existingLoadMore.remove();

    visibleCars.forEach(car => {
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

    if (currentVisibleCars < filtered.length) {
        const loadMoreContainer = document.createElement("div");
        loadMoreContainer.id = "load-more-container";
        loadMoreContainer.className = "d-flex align-items-center justify-content-center mt-4 mb-4";
        loadMoreContainer.innerHTML = `
            <hr class="flex-grow-1" style="height: 2px; background-color: #dee2e6; border: none;">
            <button id="load-more-btn" class="btn mx-3 text-uppercase fw-bold" style="background-color: #dee2e6; border-color: #dee2e6;">Load More</button>
            <hr class="flex-grow-1" style="height: 2px; background-color: #dee2e6; border: none;">
        `;
        carsContainer.appendChild(loadMoreContainer);

        document.getElementById("load-more-btn").addEventListener("click", () => {
            currentVisibleCars += 2;
            const currentClassValue = document.getElementById("class-filter") ? document.getElementById("class-filter").value : "all";
            const currentSponsorValue = document.getElementById("sponsor-filter") ? document.getElementById("sponsor-filter").value : "all";
            const currentSortValue = document.getElementById("sortBy") ? document.getElementById("sortBy").value : "all";
            generateCars(currentClassValue, currentSponsorValue, currentSortValue, false);
            animateCars();
        });
    }
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

//filter klase
const classFilter = document.getElementById("class-filter");
const sponsorFilter = document.getElementById("sponsor-filter");

function updateFilterOptions() {
    const classVal = classFilter.value;
    const sponsorVal = sponsorFilter.value;

    const sponsorMap = {
        "michelin": "Michelin",
        "mobil1": "Mobil 1",
        "tagheuer": "Tag Heuer",
        "fat": "F.A.T. International",
        "goodyear": "Goodyear",
        "weathertech": "WeatherTech"
    };

    //updejtujemo sponsor filter opcije na osnovu klase
    Array.from(sponsorFilter.options).forEach(opt => {
        if (opt.value === "all") return;
        opt.style.display = "none";
        opt.hidden = true;
        const requiredSponsor = sponsorMap[opt.value];
        const hasCarMatch = cars.some(car => {
            const classMatch = classVal === "all" || car.category === classVal;
            const spMatch = car.sponsor && car.sponsor.includes(requiredSponsor);
            return classMatch && spMatch;
        });
        if (hasCarMatch) {
            opt.style.display = "block";
            opt.hidden = false;
        } else if (sponsorVal === opt.value) {
            sponsorFilter.value = "all"; //resetujemo ako trenutno izabrani sponsor vise nije validan
        }
    });

    //updejtujemo klasu filter opcije na osnovu sponzora
    const activeSponsorVal = sponsorFilter.value; //cuvamo aktivnu vrednost sponzora
    Array.from(classFilter.options).forEach(opt => {
        if (opt.value === "all") return;
        opt.style.display = "none";
        opt.hidden = true;
        const requiredClass = opt.value;
        const requiredSponsor = activeSponsorVal !== "all" ? sponsorMap[activeSponsorVal] : null;
        const hasCarMatch = cars.some(car => {
            const classMatch = car.category === requiredClass;
            const spMatch = !requiredSponsor || (car.sponsor && car.sponsor.includes(requiredSponsor));
            return classMatch && spMatch;
        });
        if (hasCarMatch) {
            opt.style.display = "block";
            opt.hidden = false;
        } else if (classVal === opt.value) {
            classFilter.value = "all"; //resetujemo ako trenutno izabrana klasa vise nije validna
        }
    });
}

const sortFilter = document.getElementById("sortBy");

function handleFilterChange() {
    if (classFilter && sponsorFilter) updateFilterOptions();
    
    generateCars(
        classFilter ? classFilter.value : "all", 
        sponsorFilter ? sponsorFilter.value : "all", 
        sortFilter ? sortFilter.value : "all", 
        true
    );
    animateCars();
}

if (classFilter && sponsorFilter) {
    classFilter.addEventListener("change", handleFilterChange);
    sponsorFilter.addEventListener("change", handleFilterChange);
}
if (sortFilter) {
    sortFilter.addEventListener("change", handleFilterChange);
}

//carousel menja slike
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

    setInterval(changeSlide, 6000);
}

//funkcija validacija forme regex za validiranje
//blur event da se validacija pokrene kad korisnik izadje iz inputa
//input event da se greska skine cim korisnik pocne da kuca
function FormRegex() {
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const emailInput = document.getElementById("e-mail");
    const messageInput = document.getElementById("message");

    //ovo nam sluzi da vidimo da li elemnti forme postoje u DOMU, ako ne vraca null i nece izbaciti gresku
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