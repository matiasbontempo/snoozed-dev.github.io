const $ = (s) => document.querySelector(s);

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
}

function encodeInputText() {
  const link = `${window.location.protocol}//${window.location.hostname}${
    window.location.pathname
  }?md=${encodeURIComponent(
    LZUTF8.encodeBase64(
      LZUTF8.compress($("#text-input").value, [{ outputEncoding: "Base64" }])
    )
  )}`;

  const el = document.createElement("textarea");
  el.value = link;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  $("#link").innerHTML = link;
  $("#link").setAttribute("href", link);
  $("#success").classList.add("visible");
}

function toggleModal() {
  const $modal = $("#encode-modal");
  if ($modal.classList.contains("visible")) $modal.classList.remove("visible");
  else $modal.classList.add("visible");
}

document.addEventListener("DOMContentLoaded", () => {
  const md = window.markdownit({
    html: true,
    breaks: true,
    linkify: true,
    typographer: false,
  });

  const markdownString = LZUTF8.decompress(
    LZUTF8.decodeBase64(getUrlParameter("md")),
    [{ inputEncoding: "Base64" }]
  );

  $("#clipboard-button").addEventListener("click", encodeInputText);
  $("#encode-modal-button").addEventListener("click", toggleModal);
  $("#modal-backdrop").addEventListener("click", toggleModal);
  $("#close-modal").addEventListener("click", toggleModal);

  $("#text-input").value = markdownString;
  $("#preview").innerHTML = md.render(markdownString);
});
