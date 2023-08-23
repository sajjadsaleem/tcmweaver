"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { BsFolder2 } from "react-icons/bs";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import LayoutWrapper from "./components/LayoutWrapper";
import AdminLayout from "./components/AdminLayout";

import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

const Page = () => {
  const [triggerChange, setTriggerChange] = useState(false);
  const handleThemeChange = () => {
    console.log("now in index file");
    setTriggerChange(!triggerChange);
    // handleThemeChangeInMain();
  };
  // const handleWordClick = (word: string) => {
  //   console.log("word link: ", word);
  //   const matchedFile = filesData.find((file) => file.fileName === word);

  //   if (matchedFile) {
  //     console.log("Matched File Object:", matchedFile);
  //   } else {
  //     console.log("File not found: ", word);
  //   }
  //   handleFileClick(matchedFile);
  // };

  // const handleFileClick = async (content: any) => {
  //   let clickedTitle = [content];
  //   const regex = /\[\[([^[\]]+)\]\]/g;

  //   clickedTitle[0]["content"] = clickedTitle[0]["content"].replace(
  //     regex,
  //     (match, word) =>
  //       `<p style="text-decoration: underline; color: blue; cursor: pointer;">${word}</p>`
  //   );
  //   // console.log("clicked title: ", clickedTitle);

  //   setSelectedFileContent(clickedTitle);
  // };

  return (
    <LayoutWrapper layout={AdminLayout}>
      <div className="wrapper">
        <Sidebar onThemeChange={handleThemeChange} />
        {/* <Main triggerChange={triggerChange} /> */}
      </div>

      {/* <div className={"mainContainer"}>
        <div className={"mainDiv"}>
          
          <section className={"rightSection"}>
            {selectedFileContent ? (
              <div>
                <h3>{selectedFileContent[0].fileName}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: selectedFileContent[0].content,
                  }}
                  onClick={(e) => {
                    if (e.target.tagName === "P") {
                      const clickedWord = e.target.textContent; // Get the clicked word
                      handleWordClick(clickedWord);
                    }
                  }}
                />
              </div>
            ) : (
              <p>No file is open</p>
            )}
          </section>
        </div>
      </div> */}
    </LayoutWrapper>
  );
};

export default Page;
