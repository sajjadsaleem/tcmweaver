import React, { useEffect, useRef, useState } from "react";

const Main = () => {
  //   const [stopInitialThemeChange, setStopInitialThemeChange] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(0);
  console.log("tabs:", tabs);
  const hasMounted = useRef(false);
  useEffect(() => {
    // change the theme when triggerChange prop value changes not on initial render
    if (hasMounted.current) {
      // handleThemeChangeInMain();
    } else {
      hasMounted.current = true;
    }
  });

  // function handleThemeChangeInMain() {
  //   const mainDisplay = document.querySelector(`.${"main"}`);
  //   console.log("triggerChange: ", triggerChange);
  //   if (mainDisplay) {
  //     mainDisplay.classList.toggle("night-mode");
  //   }
  //   // setStopInitialThemeChange(true);
  // }

  // const addNewTab = () => {
  //   // console.log("new");
  //   const newTabId = tabs.length + 1;
  //   const newTab = {
  //     id: newTabId,
  //     label: `tab-${newTabId}`,
  //   };

  //   setTabs([...tabs, newTab]);
  //   activeTab(newTabId);
  // };

  // const closeTab = (id) => {
  //   console.log("id:", id);
  //   const updatedTabs = tabs.filter((tab) => tab.id !== id);
  //   console.log("updatedTabs: ", updatedTabs);
  //   const updatedTabsWithIDs = updatedTabs.map((tab, index) => ({
  //     ...tab,
  //     id: index + 1,
  //     label: `tab ${index + 1}`,
  //   }));

  //   setTabs(updatedTabsWithIDs);

  //   if (activeTabId === id) {
  //     setActiveTabId(2);
  //   }
  // };

  // const activeTab = (id) => {
  //   console.log("new id: ", id);
  //   setActiveTabId(id);
  // };

  return (
    <div className="main">
      {/* <div className="top-header">
        <div className="d-flex">
          <div className="big-header">
            <div
              className={`tab tab-1 ${activeTabId === 0 ? "" : "tab-2"}`}
              onClick={() => activeTab(0)}
            >
              <div>
                <img src="/home.png" alt="img" />

                <p>
                  <i className="fa fa-house"></i>
                  home
                </p>
              </div> */}
      {/* <div>
                  <img
                    src="/xmark.png"
                    alt="img"
                    onClick={() => closeTab(tab.id)}
                  />
                </div> */}
      {/* </div>
            {tabs.map((tab, index) => (
              <div
                className={`tab tab-1 ${activeTabId === tab.id ? "" : "tab-2"}`}
                key={tab.id}
                onClick={() => activeTab(tab.id)}
              >
                <div>
                  {index === 0 && tab.label === "home" && (
                    <img src={tab.icon} alt="img" />
                  )}
                  <p>
                    <i className="fa fa-house"></i>
                    {tab.label}
                  </p>
                </div>
                <div>
                  <img
                    src="/xmark.png"
                    alt="img"
                    onClick={() => closeTab(tab.id)}
                  />
                </div>
              </div>
            ))}
            <img
              src="/plus.png"
              alt="img"
              className="new-tab-icon"
              onClick={addNewTab}
            />
          </div>

          <div className="dropdown header-dropdown small-header">
            <div
              className="tab tab-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <p>
                <i className="fa fa-house"></i>
                home
              </p>
              <div>
                <i className="fa fa-angle-down"></i>
              </div>
            </div>
            <div className="dropdown-menu">
              <div className="tab tab-2">
                <p>Markdown</p>
                <div>
                  <i className="fa fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-img">
          <div className="profile-avatar">
            <img src="/profile-pic.webp" alt="img" />
          </div>
        </div>
      </div>
      <div className="content"></div> */}
    </div>
  );
};

export default Main;
