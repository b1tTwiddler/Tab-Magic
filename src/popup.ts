import "./style.css";
interface tabData {
  title?: string;
  url?: string;
}

function createObjectFromTabsData(tabs: chrome.tabs.Tab[]) {
  const hostNames: Record<string, tabData[]> = {};
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
  return hostNames;
}
async function showTabsList() {
  try {
    const tabs = await chrome.tabs.query({});
    let hostNames = createObjectFromTabsData(tabs);
    const tabList = document.getElementById("tabList");
    var h2_elem = document.createElement("h2");
    h2_elem.textContent = tabs.length.toString();
    h2_elem.classList.add("text-lg", "mt-8", "text-center", "text-green-400");
    tabList?.appendChild(h2_elem);

    console.log("start...");
    for (let value in hostNames) {
      let div = document.createElement("div");
      div.classList.add("py-2", "h-16");
      let h5 = document.createElement("h5");
      h5.textContent = value;
      h5.classList.add("text-lg", "text-center", "text-gray-600", "translate-y-1/4");
      div?.appendChild(h5);
      tabList?.appendChild(div);
      let ul = document.createElement("ul");

      for (let val of hostNames[value]) {
        let div = document.createElement("div");
        div.classList.add("px-6", "py-2", "border-transparent", "border-b-gray-500", "border-[1px]", "cursor-pointer");
        let li = document.createElement("li");
        li.textContent = val.title as string;
        li.classList.add("text-sm", "text-center", "text-blue-400");
        console.log(val.title);
        div.appendChild(li);
        ul.appendChild(div);
      }

      tabList?.appendChild(ul);
    }
    // console.log(JSON.stringify(hostNames));
  } catch (err) {}
}
showTabsList();

function getHostname(url: string | undefined): string {
  if (url === undefined) return "";
  // Create a new URL object using the provided string
  const parsedUrl = new URL(url);

  // Return the hostname property from the URL object
  if (!parsedUrl.hostname) return "localFiles";
  return parsedUrl.hostname;
}
async function bookmarkTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    let hostNames = createObjectFromTabsData(tabs);
    // let favoritesBarFolderId = await getBookmarksFolderId({ title: "Favorites bar" });
    let parentFolderId = await getBookmarksFolderId({ title: "Tab-Magic" });
    if (!parentFolderId) {
      parentFolderId = await createBookmark({ parentId: "1", title: "Tab-Magic" });
    }
    for (let hostName in hostNames) {
      let hostNameFolderId = await getBookmarksFolderId({ title: hostName });
      if (!hostNameFolderId) {
        hostNameFolderId = await createBookmark({ parentId: parentFolderId, title: hostName });
      }
      for (let tabObject of hostNames[hostName]) {
        let { title, url } = tabObject;
        let tabObjectBookmarkId = await getBookmarksFolderId({ title: title, url: url });
        if (!tabObjectBookmarkId) {
          tabObjectBookmarkId = await createBookmark({ parentId: hostNameFolderId, title: title, url: url });
        }
      }
    }
    console.log("bookmark completed!");
  } catch (err) {
    console.error(err);
  }
}
async function getBookmarksFolderId(query: chrome.bookmarks.BookmarkSearchQuery) {
  try {
    let folders = await chrome.bookmarks.search(query);
    if (folders.length > 0) {
      return folders[0].id;
    }
  } catch (err) {
    console.error(err);
  }
}
async function createBookmark(query: chrome.bookmarks.BookmarkCreateArg) {
  try {
    let newBookmark = await chrome.bookmarks.create(query);
    return newBookmark.id;
  } catch (err) {
    console.error(err);
  }
}

async function reloadTabs() {
  try {
    let tabs = await chrome.tabs.query({});
    if (tabs.length === 0) {
      return;
    }
    let promises = [];
    for (let tab of tabs) {
      promises.push(chrome.tabs.reload(tab.id as number));
    }
    Promise.all(promises)
      .then(() => console.log("tabs reloaded successfully"))
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
}

// async function createBookmark(parentId:);
document.addEventListener("DOMContentLoaded", function () {
  document?.getElementById("bookmark-tabs")?.addEventListener("click", bookmarkTabs);
  document?.getElementById("reload-tabs")?.addEventListener("click", reloadTabs);
});
