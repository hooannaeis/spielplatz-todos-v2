export const actions = {
  track(state, payload) {
    this.$fire.analytics.logEvent(payload.eventName, {
      uid: state.rootState?.user?.user?.uid,
      debug_mode: document.location.host.includes("localhost"),
      ...payload.eventParams
    })
  }
}

export const getters = {
  getNextDoneItemCount: (state) => (listId) => {
    const cookieName = "doneItemCounts"
    const rawCookie = getCookie(cookieName) || "{}";
    const doneItemCounts = JSON.parse(rawCookie);

    if (doneItemCounts[listId]) {
      doneItemCounts[listId] += 1
    } else {
      doneItemCounts[listId] = 1
    }
    setCookie(cookieName, JSON.stringify(doneItemCounts), 30)
    console.log("getting done item Count for ", listId)
    return doneItemCounts[listId]
  }
}


function setCookie(cname, cvalue, exminutes) {
  const d = new Date();
  d.setTime(d.getTime() + (exminutes * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
