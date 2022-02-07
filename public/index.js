/* let's go! */
const searchBtn = document.querySelector(".search-btn");
const userName = document.querySelector(".user-name");

const domManpulation = (selector, cb) => {
  let element = document.querySelector(selector);
  cb(element);
};

const fetch = (link, cb) => {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        cb({
          error: false,
          status: xhr.status,
          response: JSON.parse(xhr.responseText),
        });
      } else {
        cb({
          error: true,
          status: xhr.status,
          response: JSON.parse(xhr.responseText).message,
        });
      }
    }
  };
  xhr.open("GET", link);
  xhr.setRequestHeader(
    "Authorization",
    "token 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"
  );
  xhr.send();
};

searchBtn.addEventListener("click", () => {
  const userNameValue = userName.value;

  const url = ` https://api.github.com/users/${userNameValue}`;
  const repoUrl = `https://api.github.com/users/${userNameValue}/repos`;

  fetch(url, (data) => {
    const { error, status, response } = data;
    if (error) {
      console.log(response);
      console.log(status);
    } else {
      domManpulation("#github-user-handle", (ele) => {
        ele.textContent = response.login;
      });

      domManpulation("#github-user-link", (ele) => {
        ele.href = response.html_url;
      });

      domManpulation("#github-user-avatar", (ele) => {
        ele.src = response.avatar_url;
      });
      domManpulation("#github-user-repos", (ele) => {
        ele.textContent = response.public_repos;
      });
    }
    //languages ???
    //total stars ???
  });
  fetch(repoUrl, (data) => {
    const { error, statue, response } = data;
    if (error) {
      console.log(response);
    } else {
      domManpulation("#github-repo-name", (ele) => {
        ele.textContent = response[0].name;
      });

      domManpulation("#github-repo-link", (ele) => {
        ele.href = response[0].html_url;
      });
      domManpulation("#github-repo-created", (ele) => {
        ele.textContent = response[0].created_at;
      });
      domManpulation("#github-repo-open-issues", (ele) => {
        ele.textContent = response[0].open_issues_count;
      });
      domManpulation("#github-repo-watchers", (ele) => {
        ele.textContent = response[0].watchers;
      });
      domManpulation("#github-repo-contributors", (ele) => {
        fetch(response[0].contributors_url, ({ response }) => {
          ele.textContent = "";
          response.forEach((element) => {
            ele.textContent += element.login + " ";
          });
        });
      });
    }
  });
});
