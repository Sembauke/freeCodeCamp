import React, {RefObject, useRef } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { createSelector } from 'reselect';
import { isDonationModalOpenSelector, userSelector } from '../../../redux';
import {
  canFocusEditorSelector,
  consoleOutputSelector,
  visibleEditorsSelector
} from '../redux';
import { getTargetEditor } from '../utils/get-target-editor';
import './editor.css';
import { ChallengeFiles, Test, ResizeProps, Ext, FileKey} from '../../../redux/prop-types';
import { Themes } from '../../../components/settings/theme';
import Editor from './editor';

interface VisibleEditors {
  scriptjs: boolean;
  indexjsx: boolean;
  stylescss: boolean;
  indexhtml: boolean;
}

interface MultiFileEditorProps {
  canFocus: boolean;
  challengeFiles: ChallengeFiles;
  containerRef: RefObject<HTMLElement>;
  contents: string;
  description: string | null;
  dimensions: Record<string, unknown>;
  editorRef: React.RefObject<HTMLElement>;
  ext: Ext;
  fileKey: FileKey;
  initialEdiorContent: string;
  initialExt: string;
  initialTests: Test[];
  output: string[]
  resizeProps: ResizeProps;
  theme: Themes;
  title: string;
  showProjectPreview: boolean;
  usesMultifileEditor: boolean;
  visibleEditors: VisibleEditors;
}


const mapStateToProps = createSelector(
  visibleEditorsSelector,
  canFocusEditorSelector,
  consoleOutputSelector,
  isDonationModalOpenSelector,
  userSelector,
  (visibleEditors: VisibleEditors, canFocus: boolean, output: string, open, theme: Themes.Default) => ({
    visibleEditors,
    canFocus: open ? false : canFocus,
    output,
    theme
  })
);

const MultifileEditor = (props: MultiFileEditorProps): JSX.Element => {
  const {
    challengeFiles,
    containerRef,
    description,
    editorRef,
    initialTests,
    theme,
    resizeProps,
    title,
    visibleEditors: { stylescss, indexhtml, scriptjs, indexjsx },
    usesMultifileEditor,
    showProjectPreview
  } = props;
  const editorTheme = theme === 'night' ? 'vs-dark-custom' : 'vs-custom';
  // TODO: the tabs mess up the rendering (scroll doesn't work properly and
  // the in-editor description)

  const reflexProps = {
    propagateDimensions: true
  };

  const targetEditor = getTargetEditor(challengeFiles);

  // Only one editor should be focused and that should happen once, after it has
  // been mounted. This ref allows the editors to co-ordinate, without having to
  // resort to redux.
  const canFocusOnMountRef = useRef(true);

  const editorKeys = [];

  if (indexjsx) editorKeys.push('indexjsx');
  if (indexhtml) editorKeys.push('indexhtml');
  if (stylescss) editorKeys.push('stylescss');
  if (scriptjs) editorKeys.push('scriptjs');

  const editorAndSplitterKeys = editorKeys.reduce((acc: string[], key: string): string[] => {
    if (acc.length === 0) {
      return [key];
    } else {
      return [...acc, `${key}-splitter`, key];
    }
  }, []);

  return (
    <ReflexContainer
      orientation='horizontal'
      {...reflexProps}
      {...resizeProps}
      className='editor-container'
    >
      <ReflexElement flex={10} {...reflexProps} {...resizeProps}>
        <ReflexContainer orientation='vertical'>
          {editorAndSplitterKeys.map((key: FileKey) => {
            const isSplitter = key.endsWith('-splitter');
            if (isSplitter) {
              return (
                <ReflexSplitter propagate={true} {...resizeProps} key={key} />
              );
            } else {
              return (
                <ReflexElement {...reflexProps} {...resizeProps} key={key}>
                  <Editor
                    canFocusOnMountRef={canFocusOnMountRef}
                    challengeFiles={challengeFiles}
                    containerRef={containerRef}
                    description={targetEditor === key ? description : ''}
                    editorRef={editorRef}
                    fileKey={key}
                    initialTests={initialTests}
                    resizeProps={resizeProps}
                    theme={editorTheme}
                    title={title}
                    usesMultifileEditor={usesMultifileEditor}
                    showProjectPreview={showProjectPreview}
                  />
                </ReflexElement>
              );
            }
          })}
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}

export default MultifileEditor;