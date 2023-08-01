let urlSplit = window.location.href.split("/"); urlSplit.pop();
const site = urlSplit.join("/") + "/"

window.onload = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	if (!urlParams.has('post') && !urlParams.has('allProjects')) {
		let t_html = `<div><div class="container-xl px-3 px-md-6 mt-6 pt-3"><header class="d-lg-flex gutter-lg mb-6"><div class="col-12 mb-3 mb-lg-0"><h1 id="title-h1">MeeplabsDev<!-- --></h1><div class="f2 colour-text-subtle mb-3"><p>I'm Ethan, I do full-stack software and web development.</p></div></div></header></div><div><div class="container-xl px-3 px-md-6 mt-6"><div class="d-lg-flex gutter my-6 py-6"><div class="col-12 mb-4 mb-lg-0 col-lg-4"><div class="mb-4 d-flex flex-items-baseline"><h2 id="topProjectsTitle" class="f4 text-semibold">Top Projects</h2></div><ul id="topProjects" class="article-column"></ul></div><div class="col-12 mb-4 mb-lg-0 col-lg-4"><div class="mb-4 d-flex flex-items-baseline"><h2 id="currentProjectsTitle" class="f4 text-semibold">Current Projects</h2></div><ul id="currentProjects" class="article-column"></ul></div><div class="col-12 mb-4 mb-lg-0 col-lg-4"><div class="mb-4 d-flex flex-items-baseline"><h2 id="allProjectsTitle" class="f4 text-semibold">All Projects</h2><a rel="noopener" class="ml-4" href="/?allProjects">View all<!-- --><svg focusable="false" role="img" class="v-align-middle" viewboxed="0 0 16 16" width="14" height="14" fill="currentColor" style="display:inline-block;user-select:none;vertical-align:text-bottom;overflow:visible"><path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" /></svg></a></div><ul id="allProjects" class="article-column"></ul></div></div></div><div class="color-bg-subtle py-6"><div class="container-xl px-3 px-md-6 mt-6 my-6"><div><div class="d-lg-flex flex-items-stretch"><ul id="blogPosts" class="d-flex flex-wrap gutter width-full"></ul></div></div></div></div></div></div>`
		document.getElementById('main-content').innerHTML = t_html;

		updateNums();
		updateCards();
	} else {
		if (urlParams.has('allProjects')) {
			loadAllProjects();
		} else {
			loadPost(urlParams.get('post'));
		}
	}
}

function addpost(group, itemLink, itemName, itemDescription, itemDate) {
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

	let postGroup = document.getElementById(group);
	let itemHtml;
	if (group == "allProjects") {
		itemHtml = `<li class="outer-list-item width-full border-top"><div my_id="list-item-divide" class="list-item"><span class="inner-list-item"><a rel="noopener" class="no-underline d-block py-1 py-3" href="${itemLink}"><span class="f4 text-bold d-block">${itemName}</span><time class="tooltipped tooltipped-n colour-text-subtle text-mono mt-1">${date}</time></a></span></div></li>`;
	} else if (group == "blogPosts") {
		itemHtml = `<li class="col-lg-4 col-12 mb-4 list-style-none"><a class="boxed color-shadow-medium height-full d-block hover-shadow-large no-underline colour-text p-5" href="${itemLink}"><h3 class="f2">${itemName}</h3><p class="mt-2 mb-4 colour-text-subtle">${itemDescription}</p><footer class="d-flex"><div>${date}</div></footer></a></li>`;
	} else {
		itemHtml = `<li class="outer-list-item width-full border-top"><div my_id="list-item-divide" class="list-item"><span class="inner-list-item"><a rel class="no-underline d-block py-1 py-3" href="${itemLink}"><h3 class="f4"><span>${itemName}</span></h3><p class="hide-overflow colour-text-subtle mb-0 mt-1" style="-webkit-line-clamp:2"><span>${itemDescription}</span></p></a></span></div></li>`;
	}

	postGroup.innerHTML += itemHtml;
}

function addpostFromObject(post, topOverride) {
	let overrideUrl = post["overrideUrl"];
	if (overrideUrl != undefined) {
		let name = post["name"];
		let id = post["id"];
		let description = overrideUrl;
		let isBlog = post["blog"];
		let isActive = post["active"];
		let date = post["date"];

		if (topOverride) {
			addpost("topProjects", getLink(id), name, description, date);
		} else {
			if (isBlog) {
				addpost("blogPosts", getLink(id), name, description, date);
			} else {
				if (isActive) {
					addpost("currentProjects", getLink(id), name, description, date);
				} else {
					addpost("allProjects", getLink(id), name, description, date);
				}
			}
		}
	} else {
		let endpoint = site + "posts/" + post["id"] + "/content.md";
		fetch(endpoint).then((res) => res.text()).then((data) => {
			let name = post["name"];
			let id = post["id"];
			let description = parseTextFromMarkDown(data).join(" - ").substring(0, 97) + "...";
			let isBlog = post["blog"];
			let isActive = post["active"];
			let date = post["date"];
	
			if (topOverride) {
				addpost("topProjects", getLink(id), name, description, date);
			} else {
				if (isBlog) {
					addpost("blogPosts", getLink(id), name, description, date);
				} else {
					if (isActive) {
						addpost("currentProjects", getLink(id), name, description, date);
					} else {
						addpost("allProjects", getLink(id), name, description, date);
					}
				}
			}
		})
	}
}

function updateNums() {
	var allProjectsTitle = document.getElementById("allProjectsTitle");
	var currentProjectsTitle = document.getElementById("currentProjectsTitle");

	let endpoint = site + "posts/posts.json";
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data)
		var currentNum = dat.posts.stats.current;
		var completeNum = dat.posts.stats.complete;

		allProjectsTitle.innerText = `All Projects (${(currentNum + completeNum).toString()})`;
		currentProjectsTitle.innerText = `Current Projects (${currentNum.toString()})`;
	})
}

function updateCards() {
	let tops = [];

	let endpoint = site + "posts/posts.json";
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data);
		let posts = dat["posts"]["all"];
		for (i in posts) {
			let post = posts[i];
			addpostFromObject(post, false);
			let isBlog = post["blog"];
			let isActive = post["active"];

			if (!isBlog && !isActive) {
				tops.push(post);
			}
		}

		if (tops.length > 0) {
			let shuffled = tops.sort(() => 0.5 - Math.random());
			let selected = shuffled.slice(0, Math.min(3, tops.length));

			selected.forEach(selectedpost => {
				addpostFromObject(selectedpost, true);
			})
		}
	})
}

function loadAllProjects() {
	let t_html = '<div><div class="container-xl px-3 px-md-6 mt-6 pt-3"><header class="d-lg-flex gutter-lg mb-6"><div class="col-12 mb-3 mb-lg-0"><h1 id="title-h1">All Projects<!-- --></h1></div></header></div><div><div class="container-xl px-3 px-md-6 mt-6"><div class="d-lg-flex gutter my-6 py-6"><div class="col-12 mb-4 mb-lg-0 col-lg-4"><div class="mb-4 d-flex flex-items-baseline"><h2 id="allProjectsTitle" class="f4 text-semibold">All Projects (1)</h2></div><ul id="allProjects" class="article-column"></ul></div></div></div></div></div>';
	document.getElementById('main-content').innerHTML = t_html;

	let endpoint = site + "posts/posts.json";
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data);
		let posts = dat["posts"]["all"];
		for (i in posts) {
			let post = posts[i];
			let isBlog = post["blog"];

			if (!isBlog) {
				addpostFromObject(post, false);
			}
		}
		updateNums();
	})
}

function getLink(id) {
	return "?post=" + id;
}

function loadPost(id) {
	let endpoint = site + "posts/posts.json";
	fetch(endpoint).then((res) => res.text()).then((data) => {
		let dat = JSON.parse(data);
		let posts = dat["posts"]["all"];
		for (i in posts) {
			let post = posts[i];
			let postid = post["id"];
			if (postid == id) {
				let overrideUrl = post["overrideUrl"];
				if (overrideUrl != undefined) {
					document.location.href = overrideUrl;
				} else {
					let endpoint = site + "posts/" + post["id"] + "/content.md";
					fetch(endpoint).then((res) => res.text()).then((data) => {
						let t_html = `<div class="container-xl px-3 px-md-6 mt-6 pt-3">${marked.parse(data, { mangle: false, headerIds: false })}</div>`;
						document.getElementById('main-content').innerHTML = t_html;
					})
				}
			}
		}
	})
}

function parseTextFromMarkDown(mdString) {
	const htmlString = marked.parse(mdString, { mangle: false, headerIds: false });
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');
	const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
  
	const textList = [];
	let currentNode = walker.currentNode;
  
	while(currentNode) {
	  	textList.push(currentNode.textContent);
	  	currentNode = walker.nextNode();
	}

	return textList.filter((str) => str !== '' && str !== '\n' && str !== null);
}