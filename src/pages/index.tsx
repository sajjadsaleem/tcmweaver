"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { BsFolder2 } from "react-icons/bs";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import LayoutWrapper from "./components/LayoutWrapper";
import AdminLayout from "./components/AdminLayout";

import Sidebar from "./components/Sidebar";

const page = () => {
  const [selectedFileContent, setSelectedFileContent] = useState<any>(null);

  const handleWordClick = (word: string) => {
    console.log("word link: ", word);
    const matchedFile = filesData.find((file) => file.fileName === word);

    if (matchedFile) {
      console.log("Matched File Object:", matchedFile);
    } else {
      console.log("File not found: ", word);
    }
    handleFileClick(matchedFile);
  };

  const handleFileClick = async (content: any) => {
    let clickedTitle = [content];
    const regex = /\[\[([^[\]]+)\]\]/g;

    clickedTitle[0]["content"] = clickedTitle[0]["content"].replace(
      regex,
      (match, word) =>
        `<p style="text-decoration: underline; color: blue; cursor: pointer;">${word}</p>`
    );
    // console.log("clicked title: ", clickedTitle);

    setSelectedFileContent(clickedTitle);
  };

  return (
    <LayoutWrapper layout={AdminLayout}>
      <div className="wrapper">
        <Sidebar></Sidebar>

        {/* <div className={"main"}>
          <div className={"navOpen"}>
            <button>
              <i className="fa fa-arrow-right-long"></i>
            </button>
          </div>
          <div className={"topHeader"}>
            <div className={`d-flex`}>
              <div className={`big-header`}>
                <div className={`tab tab-1`}>
                  <p>
                    <i className={`fa fa-house`}></i>
                    home
                  </p>
                </div>
                <div className={`tab tab-2`}>
                  <p>Markdown</p>
                  <div>
                    <i className={`fa fa-xmark`}></i>
                  </div>
                </div>
              </div>

              <div className={`dropdown header-dropdown small-header`}>
                <div
                  className={`tab tab-1`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <p>
                    <i className={`fa fa-house`}></i>
                    home
                  </p>
                  <div>
                    <i className={`fa fa-angle-down`}></i>
                  </div>
                </div>
                <div className={`dropdown-menu`}>
                  <div className={`tab tab-2`}>
                    <p>Markdown</p>
                    <div>
                      <i className={`fa fa-xmark`}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`profile-img`}>
              <div className={`profile-avatar`}>
                <img src="/assest-3.webp" alt="img" />
              </div>
            </div>
          </div>
        </div>  */}
      </div>

      {/* <div className={"mainContainer"}>
        <div className={"mainDiv"}>
          <section className={"leftSection"}>
            <input
              type="text"
              className={"searchButton"}
              placeholder="Smart search"
              value={searchValue}
              onChange={handleSearch}
            />
            {searchValue.length > 0 && (
              <div>
                {searchResults.map((result, index) => (
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3
                        dangerouslySetInnerHTML={{
                          __html: result.highlightedFileName,
                        }}
                        style={{ margin: "0px", cursor: "pointer" }}
                        onClick={() => handleFileClick(result["item"])}
                      />
                      <h3 style={{ margin: "0px" }}>
                        {result["wordOccurence"]}
                      </h3>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: result.highlightedContent,
                      }}
                      style={{
                        margin: "0px 0px 10px 0px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // Number of lines to show
                        WebkitBoxOrient: "vertical",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
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

export default page;
