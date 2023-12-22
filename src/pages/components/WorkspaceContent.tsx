import React from 'react';
import { CircularProgress } from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface WorkspaceContentProps {
    key?: any;
    result?: any;
    index?: any;
    moveResult?: any;
    handleLinkClick?: any;
    themeChangericon?: any;
    collapseOpenedResult?: any;
    removeBothSearchResults?: any;
    linkClickLoader?: any;
    linkClickedId?: any;
    children?: React.ReactNode;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({
    key,
    result,
    index,
    moveResult,
    handleLinkClick,
    themeChangericon,
    collapseOpenedResult,
    removeBothSearchResults,
    linkClickLoader,
    linkClickedId,
    children
}) => {
    const [, ref] = useDrag({ type: 'OPENED_RESULT', item: { index }, })

    const [, drop] = useDrop({
        accept: 'OPENED_RESULT',
        hover: (draggedItem: any) => {
            if (draggedItem.index !== index) {
                moveResult(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} className="opened-results" id={result?.id ?? 'defaultId'}>
            <div className="view-panel-title">
                <h4>{result?.fileName?.toUpperCase() ?? 'DefaultFileName'}</h4>
                {result?.openedFromResults ? (
                    <div className="view-panel-title-icons">
                        {themeChangericon ? (
                            <img src="/arrow-leftnew.png" alt="img" onClick={() => collapseOpenedResult(result)} />
                        ) : (
                            <img src="/arrow-left-dark.png" alt="img" onClick={() => collapseOpenedResult(result)} />
                        )}

                        {linkClickLoader && result?.id === linkClickedId ? (
                            <CircularProgress size={16} style={{ color: 'black' }} />

                        ) : (
                            <>
                                {themeChangericon ? (
                                    <img src="/xmarknew.png" alt="img" onClick={() => removeBothSearchResults(result)} />
                                ) : (
                                    <img src="/xmark-dark.png" alt="img" onClick={() => removeBothSearchResults(result)} />
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        {linkClickLoader && result?.id === linkClickedId ? (
                            <CircularProgress size={16} style={{ color: 'black', scale: '0.75', opacity: '0.5' }} />

                        ) : (
                            <>
                                {themeChangericon ? (
                                    <img src="/collapsenew.png" alt="img" onClick={() => collapseOpenedResult(result)}
                                        className="link-collapse-icon"
                                    />
                                ) : (
                                    <img src="/collapse-dark.png" alt="img" onClick={() => collapseOpenedResult(result)}
                                        className="link-collapse-icon"
                                    />
                                )}
                            </>
                        )}

                    </div>
                )}
            </div>

            <div className="opened-result-detail">
                <p dangerouslySetInnerHTML={{ __html: result?.content ?? '' }} className="opened-result-description"
                    onClick={(e: any) => {
                        if (e.target.tagName === "SPAN" && e.target.style.textDecoration === "underline") {
                            const clickedWord = e.target.textContent;
                            handleLinkClick(result?.fileName, clickedWord, result);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default WorkspaceContent;
