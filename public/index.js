/* let's go! */
const searchBtn = document.querySelector(".search-btn");
const userName = document.querySelector(".user-name");
const errheader = document.querySelector(".err-handler");
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
  // xhr.setRequestHeader(
  //   "Authorization",
  //   "token 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"
  // );
  xhr.send();
};

searchBtn.addEventListener("click", () => {
  const userNameValue = userName.value;

  const url = ` https://api.github.com/users/${userNameValue}`;
  const repoUrl = `https://api.github.com/users/${userNameValue}/repos`;

  fetch(url, (data) => {
    const { error, status, response } = data;

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
  });
  fetch(repoUrl, (data) => {
    const { error, statue, response } = data;
    if (error) {
      domManpulation(".container", (ele) => {
        ele.style.opacity = 0;
        errheader.textContent = "Please try a valid user";
      });
    } else {
      errheader.textContent = "";
      domManpulation(".container", (ele) => {
        ele.style.opacity = 1;
      });

      domManpulation("#github-repos-languages", (ele) => {
        let languagesArr = [];
        response.forEach((ele) => {
          if (ele.language !== null) languagesArr.push(ele.language);
        });
        let filteredLanguageArr = [...new Set(languagesArr)];

        ele.textContent = filteredLanguageArr.join(", ");
      });

      domManpulation("#github-repos-stars", (ele) => {
        let startSum = 0;
        response.forEach((ele) => {
          startSum += ele.stargazers_count;
        });
        ele.textContent = startSum;
      });

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
