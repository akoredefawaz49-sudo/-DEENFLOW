/* =========================================
   DEENFLOW V1 + SUPABASE AUTH
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

    searchPanel?.classList.add("show");

    setTimeout(() => {
      searchInput?.focus();
    }, 300);

  });

  closeSearch?.addEventListener("click", () => {
    searchPanel?.classList.remove("show");
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
     AUTO PLAY VIDEOS
  ========================================= */

  if ("IntersectionObserver" in window) {

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

  }


  /* =========================================
     LIKE BUTTON
  ========================================= */

  document.querySelectorAll(".like-btn").forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      const icon = button.querySelector("i");
      const count = button.querySelector("span");

      if (!count) return;

      const currentText = count.textContent.trim();

      if (!button.classList.contains("liked")) {

        button.classList.add("liked");

        icon?.classList.remove("fa-regular");
        icon?.classList.add("fa-solid");

        count.textContent = increaseCount(currentText);

      } else {

        button.classList.remove("liked");

        icon?.classList.remove("fa-solid");
        icon?.classList.add("fa-regular");

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

      if (!label) return;

      if (!button.classList.contains("saved")) {

        button.classList.add("saved");

        icon?.classList.remove("fa-regular");
        icon?.classList.add("fa-solid");

        label.textContent = "Saved";

      } else {

        button.classList.remove("saved");

        icon?.classList.remove("fa-solid");
        icon?.classList.add("fa-regular");

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

      commentsModal?.classList.add("show");

    });

  });

  closeComments?.addEventListener("click", () => {

    commentsModal?.classList.remove("show");

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

    if (!commentInput || !commentsList) return;

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
        text: "Check out this beneficial Islamic reminder on DeenFlow.",
        url: window.location.href
      };

      try {

        if (navigator.share) {

          await navigator.share(shareData);

        } else if (navigator.clipboard) {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast("Link copied!");

        } else {

          showToast("Sharing isn't supported here.");

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

    notificationModal?.classList.add("show");

  });

  closeNotifications?.addEventListener("click", () => {

    notificationModal?.classList.remove("show");

  });

  notificationModal?.addEventListener("click", event => {

    if (event.target === notificationModal) {

      notificationModal.classList.remove("show");

    }

  });


  /* =========================================
     PROFILE BUTTON → AUTH
  ========================================= */

  const profileBtn =
    document.getElementById("profileBtn");

  profileBtn?.addEventListener("click", () => {

    openAuth();

  });


  /* =========================================
     AUTHENTICATION
  ========================================= */

  const authModal =
    document.getElementById("authModal");

  const closeAuth =
    document.getElementById("closeAuth");

  const loginForm =
    document.getElementById("loginForm");

  const signupForm =
    document.getElementById("signupForm");

  const showSignup =
    document.getElementById("showSignup");

  const showLogin =
    document.getElementById("showLogin");


  function openAuth() {

    if (!authModal) {
      showToast("Login system is not available.");
      return;
    }

    authModal.classList.add("show");
    authModal.classList.add("active");

  }


  function closeAuthModal() {

    authModal?.classList.remove("show");
    authModal?.classList.remove("active");

  }


  closeAuth?.addEventListener("click", closeAuthModal);


  showSignup?.addEventListener("click", () => {

    if (loginForm) {
      loginForm.style.display = "none";
    }

    if (signupForm) {
      signupForm.style.display = "block";
    }

  });


  showLogin?.addEventListener("click", () => {

    if (signupForm) {
      signupForm.style.display = "none";
    }

    if (loginForm) {
      loginForm.style.display = "block";
    }

  });


  authModal?.addEventListener("click", event => {

    if (event.target === authModal) {
      closeAuthModal();
    }

  });


  /* =========================================
     SIGN UP
  ========================================= */

  document
    .getElementById("signupBtn")
    ?.addEventListener("click", async () => {

      const name =
        document.getElementById("signupName")?.value.trim();

      const username =
        document.getElementById("signupUsername")?.value.trim();

      const email =
        document.getElementById("signupEmail")?.value.trim();

      const password =
        document.getElementById("signupPassword")?.value;


      if (!name || !username || !email || !password) {

        showToast("Please fill in everything.");

        return;

      }


      if (password.length < 6) {

        showToast(
          "Password must be at least 6 characters."
        );

        return;

      }


      if (typeof supabaseClient === "undefined") {

        showToast("Supabase is not connected.");

        return;

      }


      showToast("Creating your account...");


      try {

        const { data, error } =
          await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

              data: {
                display_name: name
              }

            }

          });


        if (error) {

          showToast(error.message);

          return;

        }


        if (data.user) {

          const { error: profileError } =
            await supabaseClient
              .from("profiles")
              .update({

                username: username,
                display_name: name

              })
              .eq("id", data.user.id);


          if (profileError) {

            console.error(
              "Profile error:",
              profileError
            );

          }

        }


        showToast(
          "Account created successfully! 🎉"
        );


        if (signupForm) {
          signupForm.style.display = "none";
        }

        if (loginForm) {
          loginForm.style.display = "block";
        }


      } catch (error) {

        console.error(error);

        showToast(
          "Something went wrong. Please try again."
        );

      }

    });


  /* =========================================
     LOGIN
  ========================================= */

  document
    .getElementById("loginBtn")
    ?.addEventListener("click", async () => {

      const email =
        document.getElementById("loginEmail")?.value.trim();

      const password =
        document.getElementById("loginPassword")?.value;


      if (!email || !password) {

        showToast(
          "Enter your email and password."
        );

        return;

      }


      if (typeof supabaseClient === "undefined") {

        showToast("Supabase is not connected.");

        return;

      }


      showToast("Signing you in...");


      try {

        const { data, error } =
          await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

          });


        if (error) {

          showToast(error.message);

          return;

        }


        showToast("Welcome back! 👋");

        closeAuthModal();

        console.log(
          "Logged in user:",
          data.user
        );


        await loadCurrentProfile();


      } catch (error) {

        console.error(error);

        showToast(
          "Login failed. Please try again."
        );

      }

    });


  /* =========================================
     CHECK CURRENT SESSION
  ========================================= */

  async function checkAuth() {

    if (typeof supabaseClient === "undefined") {

      console.log(
        "Supabase client not available."
      );

      return;

    }


    try {

      const { data, error } =
        await supabaseClient.auth.getSession();


      if (error) {

        console.error(error);

        return;

      }


      if (data.session) {

        console.log(
          "DeenFlow user:",
          data.session.user
        );

        await loadCurrentProfile();

      } else {

        console.log(
          "No user currently logged in."
        );

      }

    } catch (error) {

      console.error(error);

    }

  }


  /* =========================================
     LOAD CURRENT PROFILE
  ========================================= */

  async function loadCurrentProfile() {

    if (typeof supabaseClient === "undefined") {
      return;
    }


    const {
      data: { user }
    } = await supabaseClient.auth.getUser();


    if (!user) return;


    const { data, error } =
      await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


    if (error) {

      console.error(
        "Could not load profile:",
        error
      );

      return;

    }


    console.log(
      "Current DeenFlow profile:",
      data
    );

  }


  /* =========================================
     VIDEO UPLOAD PREVIEW
  ========================================= */

  const videoUpload =
    document.getElementById("videoUpload");

  videoUpload?.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;


    if (!file.type.startsWith("video/")) {

      showToast(
        "Please select a video file."
      );

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

      const file =
        videoUpload?.files[0];


      if (!file) {

        showToast(
          "Please select a video first."
        );

        return;

      }


      showToast(
        "Video selected. Real publishing comes next."
      );

    });


  /* =========================================
     SEARCH SUGGESTIONS
  ========================================= */

  document
    .querySelectorAll(".search-suggestions span")
    .forEach(suggestion => {

      suggestion.addEventListener("click", () => {

        if (searchInput) {

          searchInput.value =
            suggestion.textContent;

        }

      });

    });


  /* =========================================
     UTILITY FUNCTIONS
  ========================================= */

  function increaseCount(value) {

    const match =
      value.match(/([\d.]+)([KMB]?)/i);


    if (!match) return value;


    let number =
      parseFloat(match[1]);

    const suffix =
      match[2];


    number += 0.1;


    return number.toFixed(1) + suffix;

  }


  function decreaseCount(value) {

    const match =
      value.match(/([\d.]+)([KMB]?)/i);


    if (!match) return value;


    let number =
      parseFloat(match[1]);

    const suffix =
      match[2];


    number =
      Math.max(0, number - 0.1);


    return number.toFixed(1) + suffix;

  }


  function escapeHTML(text) {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  }


  function showToast(message) {

    const toast =
      document.createElement("div");


    toast.textContent =
      message;


    toast.style.position =
      "fixed";

    toast.style.bottom =
      "100px";

    toast.style.left =
      "50%";

    toast.style.transform =
      "translateX(-50%)";

    toast.style.background =
      "#111";

    toast.style.color =
      "#fff";

    toast.style.padding =
      "12px 18px";

    toast.style.borderRadius =
      "10px";

    toast.style.zIndex =
      "99999";

    toast.style.fontSize =
      "13px";


    document.body.appendChild(toast);


    setTimeout(() => {

      toast.remove();

    }, 2500);

  }


  /* =========================================
     START AUTH CHECK
  ========================================= */

  checkAuth();

});

// ========================================
// DEENFLOW REAL VIDEO UPLOAD
// ========================================

const videoFileInput = document.getElementById("videoFile");
const videoCaptionInput = document.getElementById("videoCaption");
const videoCategoryInput = document.getElementById("videoCategory");
const videoSourceInput = document.getElementById("videoSource");
const publishVideoBtn = document.getElementById("publishVideo");
const uploadStatus = document.getElementById("uploadStatus");

if (publishVideoBtn) {

    publishVideoBtn.addEventListener("click", async () => {

        try {

            // Check login
            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (!user) {
                showToast("Please sign in first.");
                return;
            }

            // Check video
            const file = videoFileInput.files[0];

            if (!file) {
                showToast("Please choose a video.");
                return;
            }

            // Check source
            const source = videoSourceInput.value.trim();

            if (!source) {
                showToast("Please add the source/reference.");
                return;
            }

            // Check file type
            if (!file.type.startsWith("video/")) {
                showToast("Please select a video file.");
                return;
            }

            // Limit size to 100MB for now
            if (file.size > 100 * 1024 * 1024) {
                showToast("Video must be smaller than 100MB.");
                return;
            }

            publishVideoBtn.disabled = true;
            publishVideoBtn.textContent = "Uploading...";

            if (uploadStatus) {
                uploadStatus.textContent = "Uploading your video...";
            }

            // Create unique filename
            const fileExtension =
                file.name.split(".").pop();

            const fileName =
                `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

            // Store inside user's folder
            const filePath =
                `${user.id}/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } =
                await supabaseClient.storage
                    .from("videos")
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: file.type
                    });

            if (uploadError) {
                throw uploadError;
            }

            // Get public video URL
            const {
                data: publicUrlData
            } = supabaseClient.storage
                .from("videos")
                .getPublicUrl(filePath);

            const videoUrl =
                publicUrlData.publicUrl;

            // Save video information in database
            const { error: databaseError } =
                await supabaseClient
                    .from("videos")
                    .insert({
                        user_id: user.id,
                        video_url: videoUrl,
                        caption: videoCaptionInput.value.trim(),
                        category: videoCategoryInput.value,
                        source_reference: source,
                        views: 0
                    });

            if (databaseError) {
                // Remove uploaded file if database save fails
                await supabaseClient.storage
                    .from("videos")
                    .remove([filePath]);

                throw databaseError;
            }

            showToast("🎉 Video published successfully!");

            if (uploadStatus) {
                uploadStatus.textContent =
                    "✅ Your video is now on DeenFlow!";
            }

            // Clear form
            videoFileInput.value = "";
            videoCaptionInput.value = "";
            videoSourceInput.value = "";

            publishVideoBtn.disabled = false;
            publishVideoBtn.textContent = "Publish Video";

            // Reload feed
            if (typeof loadRealVideos === "function") {
                loadRealVideos();
            }

        } catch (error) {

            console.error("Upload error:", error);

            showToast(
                error.message || "Upload failed."
            );

            if (uploadStatus) {
                uploadStatus.textContent =
                    "❌ Upload failed.";
            }

            publishVideoBtn.disabled = false;
            publishVideoBtn.textContent = "Publish Video";
        }

    });

}
