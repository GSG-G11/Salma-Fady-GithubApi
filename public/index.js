/* let's go! */
const url = "https://api.github.com/users/Fady-Alwazir";
const repoUrl = "https://api.github.com/repos/Fady-Alwazir/test";
const domManpulation = (selector, cb) => {
  let element = document.querySelector(selector);
  cb(element);
};

const fetch = (link, cb) => {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(JSON.parse(xhr.responseText));
      console.log(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", link);
  xhr.send();
};
fetch(url, (data) => {
  domManpulation("#github-user-handle", (ele) => {
    ele.textContent = data.login;
  });

  domManpulation("#github-user-link", (ele) => {
    ele.href = data.html_url;
  });

  domManpulation("#github-user-avatar", (ele) => {
    ele.src = data.avatar_url;
  });
  domManpulation("#github-user-repos", (ele) => {
    ele.textContent = data.public_repos;
  });

  //languages ???
  //total stars ???
});
fetch(repoUrl, (data) => {
  domManpulation("#github-repo-name", (ele) => {
    ele.textContent = data.name;
  });

  domManpulation("#github-repo-link", (ele) => {
    ele.href = data.html_url;
  });
  domManpulation("#github-repo-created", (ele) => {
    ele.textContent = data.created_at;
  });
  domManpulation("#github-repo-open-issues", (ele) => {
    ele.textContent = data.open_issues_count;
  });
  domManpulation("#github-repo-watchers", (ele) => {
    ele.textContent = data.watchers;
  });
  domManpulation("#github-repo-contributors", (ele) => {
    fetch(data.contributors_url, (data) => {
      data.forEach((element) => {
        ele.textContent = element.login + " ";
      });
    });
  });
});
