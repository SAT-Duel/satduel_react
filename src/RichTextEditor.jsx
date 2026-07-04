import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import styled from 'styled-components';

window.katex = katex;

const EditorContainer = styled.div`
    .ql-editor {
        min-height: 200px;
    }
`;

const PreviewContainer = styled.div`
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    min-height: 100px;
`;

const RichTextEditor = ({value, onChange, label}) => {
    const [showPreview, setShowPreview] = useState(false);

    const modules = {
        toolbar: [
            [{'header': '1'}, {'header': '2'}, {'font': []}],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'},
                {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'formula'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'formula'
    ];

    return (
        <EditorContainer>
            <h4>{label}</h4>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
            <button onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            {showPreview && (
                <PreviewContainer dangerouslySetInnerHTML={{__html: value}}/>
            )}
        </EditorContainer>
    );
};

export default RichTextEditor;