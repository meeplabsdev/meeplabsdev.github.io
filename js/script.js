const site = "https://meeplabsdev-site-content.meeplabs.repl.co/"

window.onload = () => {
	updateNums();
	updateCards();
}

function addProject(group, itemLink, itemName, itemDescription, itemDate) {
	// groups are: topProjects, currentProjects, allProjects, blogPosts

	let date;
	if (itemDate && itemDate.split("-").length == 3) {
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let split = itemDate.split("-");
		const d = new Date(split[2], split[1] - 1, split[0]);
		let month = months[d.getMonth()];
		date = month + " " + d.getDate() + " " + d.getFullYear();
	} else {
		date = itemDate;
	}

	let projectGroup = document.getElementById(group);
	let itemHtml;
	if (group == "allProjects") {
		itemHtml = `<li class="outer-list-item width-full border-top"><div my_id="list-item-divide" class="list-item"><span class="inner-list-item"><a rel="noopener" class="no-underline d-block py-1 py-3" href="${itemLink}"><span class="f4 text-bold d-block">${itemName}</span><time class="tooltipped tooltipped-n colour-text-subtle text-mono mt-1">${date}</time></a></span></div></li>`;
	} else if (group == "blogPosts") {
		itemHtml = `<li class="col-lg-4 col-12 mb-4 list-style-none"><a class="boxed color-shadow-medium height-full d-block hover-shadow-large no-underline colour-text p-5" href="${itemLink}"><h3 class="f2">${itemName}</h3><p class="mt-2 mb-4 colour-text-subtle">${itemDescription}</p><footer class="d-flex"><div>${date}</div></footer></a></li>`;
	} else {
		itemHtml = `<li class="outer-list-item width-full border-top"><div my_id="list-item-divide" class="list-item"><span class="inner-list-item"><a rel class="no-underline d-block py-1 py-3" href="${itemLink}"><h3 class="f4"><span>${itemName}</span></h3><p class="hide-overflow colour-text-subtle mb-0 mt-1" style="-webkit-line-clamp:2"><span>${itemDescription}</span></p></a></span></div></li>`;
	}

	projectGroup.innerHTML += itemHtml;
}

function addProjectFromObject(project, topOverride) {
	let friendlyName = project["friendlyName"];
	let idName = project["idName"];
	let description = project["description"];
	let isBlog = project["blog"];
	let isActive = project["active"];
	let date = project["date"];

	if (topOverride) {
		addProject("topProjects", getLink(idName), friendlyName, description, date);
	} else {
		if (isBlog) {
			addProject("blogPosts", getLink(idName), friendlyName, description, date);
		} else {
			if (isActive) {
				addProject("currentProjects", getLink(idName), friendlyName, description, date);
			} else {
				addProject("allProjects", getLink(idName), friendlyName, description, date);
			}
		}
	}
}

function updateNums() {
	var allProjectsTitle = document.getElementById("allProjectsTitle");
	var currentProjectsTitle = document.getElementById("currentProjectsTitle");

	let endpoint = site + "stats"
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data)
		var currentNum = dat.current;
		var completeNum = dat.complete;

		allProjectsTitle.innerText = `All Projects (${(currentNum + completeNum).toString()})`;
		currentProjectsTitle.innerText = `Current Projects (${currentNum.toString()})`;
	})
}

function updateCards() {
	let tops = [];

	let endpoint = site + "projects";
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data);
		for (index in dat) {
			let project = dat[index];
			addProjectFromObject(project, false);
			let isBlog = project["blog"];
			let isActive = project["active"];

			if (!isBlog && !isActive) {
				tops.push(project);
			}
		}

		if (tops.length > 0) {
			let shuffled = tops.sort(() => 0.5 - Math.random());
			let selected = shuffled.slice(0, Math.min(3, tops.length));

			selected.forEach(selectedProject => {
				addProjectFromObject(selectedProject, true);
			})
		}
	})
}

function getLink(id) {
	let endpoint = site + "redirect?id="
	return endpoint + id;
}