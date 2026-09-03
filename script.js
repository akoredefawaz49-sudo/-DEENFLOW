/* =========================================
   DEENFLOW V1
   Frontend interaction layer
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     PAGE NAVIGATION
  ========================================= */

  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navItems.forEach(item => {

    item.addEventListener("click", () => {

      const pageId = item.dataset.page;
      const targetPage = document.getElementById(pageId);

      if (!targetPage) return;

      pages.forEach(page => {
        page.classList.remove("active");
      });

      navItems.forEach(nav => {
        nav.classList.remove("active");
      });

      targetPage.classList.add("active");
      item.classList.add("active");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });


  /* =========================================
     SEARCH PANEL
  ========================================= */

  const searchBtn = document.getElementById("searchBtn");
  const searchPanel = document.getElementById("searchPanel");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");

  searchBtn?.addEventListener("click", () => {

    searchPanel.classList.add("show");

    setTimeout(() => {
      searchInput?.focus();
    }, 300);

  });

  closeSearch?.addEventListener("click", () => {
    searchPanel.classList.remove("show");
  });


  /* =========================================
     VIDEO PLAY / PAUSE
  ========================================= */

  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach(card => {

    const video = card.querySelector(".video");
    const playButton = card.querySelector(".play-button");

    if (!video) return;

    card.addEventListener("click", event => {

      /*
        Don't pause the video when the user
        clicks an action button.
      */

      if (
        event.target.closest(".action-btn") ||
        event.target.closest(".follow-btn")
      ) {
        return;
      }

      if (video.paused) {

        video.play().catch(() => {});

        card.classList.remove("paused");

      } else {

        video.pause();

        card.classList.add("paused");

      }

    });

    playButton?.addEventListener("click", event => {

      event.stopPropagation();

      if (video.paused) {

        video.play().catch(() => {});
        card.classList.remove("paused");

      } else {

        video.pause();
        card.classList.add("paused");

      }

    });

  });


  /* =========================================
     AUTO PLAY VIDEOS WHEN VISIBLE
  ========================================= */

  const videoObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        const video = entry.target;

        if (entry.isIntersecting) {

          video.play().catch(() => {});

        } else {

          video.pause();

        }

      });

    },
    {
      threshold: 0.65
    }
  );


  document.querySelectorAll(".video").forEach(video => {
    videoObserver.observe(video);
  });


  /* =========================================
     LIKE BUTTON
  ========================================= */

  document.querySelectorAll(".like-btn").forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      const icon = button.querySelector("i");
      const count = button.querySelector("span");

      const currentText = count.textContent.trim();

      if (!button.classList.contains("liked")) {

        button.classList.add("liked");

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        /*
          Frontend demonstration only.
          Real likes will be stored in the backend later.
        */

        count.textContent = increaseCount(currentText);

      } else {

        button.classList.remove("liked");

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        count.textContent = decreaseCount(currentText);

      }

    });

  });


  /* =========================================
     SAVE BUTTON
  ========================================= */

  document.querySelectorAll(".save-btn").forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      const icon = button.querySelector("i");
      const label = button.querySelector("span");

      if (!button.classList.contains("saved")) {

        button.classList.add("saved");

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        label.textContent = "Saved";

      } else {

        button.classList.remove("saved");

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        label.textContent = "Save";

      }

    });

  });


  /* =========================================
     FOLLOW BUTTON
  ========================================= */

  document.querySelectorAll(".follow-btn").forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      if (button.classList.contains("following")) {

        button.classList.remove("following");
        button.textContent = "Follow";

      } else {

        button.classList.add("following");
        button.textContent = "Following";

      }

    });

  });


  /* =========================================
     COMMENTS
  ========================================= */

  const commentsModal =
    document.getElementById("commentsModal");

  const closeComments =
    document.getElementById("closeComments");

  document.querySelectorAll(".comment-btn").forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      commentsModal.classList.add("show");

    });

  });

  closeComments?.addEventListener("click", () => {

    commentsModal.classList.remove("show");

  });


  commentsModal?.addEventListener("click", event => {

    if (event.target === commentsModal) {

      commentsModal.classList.remove("show");

    }

  });


  /* =========================================
     COMMENT POSTING
  ========================================= */

  const commentInput =
    document.querySelector(".comment-input input");

  const commentSendButton =
    document.querySelector(".comment-input button");

  const commentsList =
    document.querySelector(".comments-list");

  function addComment() {

    const text = commentInput.value.trim();

    if (!text) return;

    const comment = document.createElement("div");

    comment.className = "comment";

    comment.innerHTML = `
      <strong>@you</strong>
      <p>${escapeHTML(text)}</p>
    `;

    commentsList.appendChild(comment);

    commentInput.value = "";

  }

  commentSendButton?.addEventListener("click", addComment);

  commentInput?.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      addComment();

    }

  });


  /* =========================================
     SHARE
  ========================================= */

  document.querySelectorAll(".share-btn").forEach(button => {

    button.addEventListener("click", async event => {

      event.stopPropagation();

      const shareData = {
        title: "DeenFlow",
        text: "Check out this beneficial Islamic reminder on DeenFlow."
      };

      try {

        if (navigator.share) {

          await navigator.share(shareData);

        } else {

          await navigator.clipboard.writeText(
            "Check out this beneficial Islamic reminder on DeenFlow."
          );

          showToast("Link copied!");

        }

      } catch (error) {

        console.log("Share cancelled.");

      }

    });

  });


  /* =========================================
     NOTIFICATIONS
  ========================================= */

  const notificationBtn =
    document.getElementById("notificationBtn");

  const notificationModal =
    document.getElementById("notificationModal");

  const closeNotifications =
    document.getElementById("closeNotifications");

  notificationBtn?.addEventListener("click", () => {

    notificationModal.classList.add("show");

  });

  closeNotifications?.addEventListener("click", () => {

    notificationModal.classList.remove("show");

  });

  notificationModal?.addEventListener("click", event => {

    if (event.target === notificationModal) {

      notificationModal.classList.remove("show");

    }

  });


  /* =========================================
     PROFILE BUTTON
  ========================================= */

  const profileBtn =
    document.getElementById("profileBtn");

  profileBtn?.addEventListener("click", () => {

    pages.forEach(page => {
      page.classList.remove("active");
    });

    navItems.forEach(nav => {
      nav.classList.remove("active");
    });

    document
      .getElementById("profilePage")
      ?.classList.add("active");

    document
      .querySelector('[data-page="profilePage"]')
      ?.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


  /* =========================================
     VIDEO UPLOAD PREVIEW
  ========================================= */

  const videoUpload =
    document.getElementById("videoUpload");

  videoUpload?.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {

      showToast("Please select a video file.");

      return;

    }

    showToast(
      `Selected: ${file.name}`
    );

  });


  /* =========================================
     PUBLISH BUTTON
  ========================================= */

  document
    .querySelector(".publish-btn")
    ?.addEventListener("click", () => {

      const file = videoUpload?.files[0];

      if (!file) {

        showToast("Please select a video first.");

        return;

      }

      showToast(
        "Demo publish complete. Backend upload comes in V2."
      );

    });


  /* =========================================
     SEARCH SUGGESTIONS
  ========================================= */

  document
    .querySelectorAll(".search-suggestions span")
    .forEach(suggestion => {

      suggestion.addEventListener("click", () => {

        searchInput.value = suggestion.textContent;

      });

    });


  /* =========================================
     UTILITY FUNCTIONS
  ========================================= */

  function increaseCount(value) {

    const match = value.match(/([\d.]+)([KMB]?)/i);

    if (!match) return value;

    let number = parseFloat(match[1]);
    const suffix = match[2];

    number += 0.1;

    return number.toFixed(1) + suffix;

  }


  function decreaseCount(value) {

    const match = value.match(/([\d.]+)([KMB]?)/i);

    if (!match) return value;

    let number = parseFloat(match[1]);
    const suffix = match[2];

    number = Math.max(0, number - 0.1);

    return number.toFixed(1) + suffix;

  }


  function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  }


  function showToast(message) {

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "100px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#111";
    toast.style.color = "#fff";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "10px";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "13px";

    document.body.appendChild(toast);

    setTimeout(() => {

      to 10 secs

    }, 2500);

  }

});

/* =========================
   AUTHENTICATION
========================= */

.auth-box {
  width: min(92%, 420px);
  padding: 30px;
  position: relative;
}

.auth-logo {
  font-size: 32px;
  font-weight: 800;
  color: var(--green);
  text-align: center;
}

.auth-tagline {
  text-align: center;
  color: var(--gray);
  margin-bottom: 25px;
}

.auth-box h2 {
  margin-bottom: 8px;
}

.auth-box p {
  color: var(--gray);
  margin-bottom: 18px;
}

.auth-box input {
  width: 100%;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  font-size: 15px;
}

.auth-box input:focus {
  border-color: var(--green);
}

.auth-btn {
  width: 100%;
  border: none;
  padding: 14px;
  border-radius: 10px;
  background: var(--green);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.auth-switch {
  text-align: center;
  margin-top: 18px;
}

.auth-switch button {
  border: none;
  background: none;
  color: var(--green);
  font-weight: 700;
  cursor: pointer;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
}
