$(() => {
  var md = window.markdownit({
    html: true,
    breaks: true,
    linkify: true,
    typographer: false,
  });

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
        LZUTF8.compress($("#text-input").val(), [{ outputEncoding: "Base64" }])
      )
    )}`;

    const el = document.createElement("textarea");
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    $("#link").html(link).attr("href", link);
    $("#success").addClass("visible");
  }

  function toggleModal() {
    $("#encode-modal").toggleClass("visible");
  }

  $("#clipboard-button").on("click", encodeInputText);
  $("#encode-modal-button").on("click", toggleModal);
  $("#modal-backdrop").on("click", toggleModal);
  $("#close-modal").on("click", toggleModal);
  $("#preview").html(
    md.render(
      LZUTF8.decompress(LZUTF8.decodeBase64(getUrlParameter("md")), [
        { inputEncoding: "Base64" },
      ])
    )
  );
});
