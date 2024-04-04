import "./style.css";
chrome.tabs.query({}, function (tabs) {
	interface tabData {
		title: string | undefined;
		url: string | undefined;
	}
	const hostNames: Record<string, tabData[]> = {};
	const tabList = document.getElementById("tabList");
	var h2_elem = document.createElement("h2");
	h2_elem.textContent = tabs.length.toString();
	tabList?.appendChild(h2_elem);
	for (let i = 0; i < tabs.length; i++) {
		let hostName = getHostname(tabs[i].url);
		if (!(hostName in hostNames)) {
			hostNames[hostName] = [];
		}
		hostNames[hostName].push({
			title: tabs[i].title,
			url: tabs[i].url,
		});
		// hostNames.add(getHostname(tabs[i].url));
	}
	console.log("start...");
	for (let value in hostNames) {
		let h5 = document.createElement("h5");
		h5.textContent = value;
		tabList?.appendChild(h5);
		let ul = document.createElement("ul");
		for (let val of hostNames[value]) {
			let li = document.createElement("li");
			li.textContent = val.title as string;
			console.log(val.title);
			ul.appendChild(li);
		}

		tabList?.appendChild(ul);
	}
	console.log(JSON.stringify(hostNames));
});

function getHostname(url: string | undefined): string {
	if (url === undefined) return "";
	// Create a new URL object using the provided string
	const parsedUrl = new URL(url);

	// Return the hostname property from the URL object
	return parsedUrl.hostname;
}
