"use client"
import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';

import JSZip from 'jszip';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import Link from '@editorjs/link';
import InlineCode from '@editorjs/inline-code';
import Delimiter from '@editorjs/delimiter';
import Raw from '@editorjs/raw';
import Underline from '@editorjs/underline';
import Checklist from '@editorjs/checklist';
import image from '@editorjs/image';
import  Marker from '@editorjs/marker';
import NestedList from '@editorjs/nested-list';

const edjsHTML = require("editorjs-html");
const Home = () => {
  const editorContainerRef = useRef(null);
  const [exportpop, setexport] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null); // Initialize with null
  useEffect(() => {
    if (editorContainerRef.current) {
      const instance = new EditorJS({
        list: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          },
        },
        holder: editorContainerRef.current,
        tools: {
          Marker: {
            class: Marker,
          },
          header: Header,
          paragraph: Paragraph,
          underline: Underline,
          image: {
            class: image,
            config: {
              uploader: {
                /**
                 * Custom uploader function that converts the selected image into a Data URL
                 * @param {File} file - The selected image file
                 * @returns {Promise} - Resolves with the Data URL
                 */
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataURL = event.target.result;
                      resolve({
                        success: 1,
                        file: {
                          url: dataURL,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                },
              },
            },
          },
          embed: Embed,
          table: Table,
          quote: Quote,
          warning: Warning,
          code: Code,
          linkTool: Link,
          marker: Marker,
          inlineCode: InlineCode,
          delimiter: Delimiter,
          raw: Raw,
          underline: Underline,
          checklist: Checklist,
        },
        
      });
      setEditorInstance(instance); // Update the instance in state

    }

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, []);

  const exportjson = async () => {
    console.log('Exporting...');
    setexport(false);
  
    if (!editorInstance) {
      console.log('Editor instance is not initialized');
      return;
    }
  
    try {
      const savedData = await editorInstance.save();
      console.log('Data saved:', savedData);
  
      const zip = new JSZip();
      zip.file('editor-content.json', JSON.stringify(savedData));
  
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'editor-content.zip';
        link.click();
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };
  

  const handleImport = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const zip = new JSZip();
        const zipContents = await zip.loadAsync(file);
  
        if (zipContents.files['editor-content.json']) {
          const jsonData = await zipContents.file('editor-content.json').async('text');
          const parsedData = JSON.parse(jsonData);
  
          if (editorInstance) {
            // Clear existing content before rendering new data
            if (editorInstance.blocks && editorInstance.blocks.length > 0) {
              editorInstance.blocks.forEach((block) => {
                editorInstance.removeBlock(block.key);
              });
            }
            editorInstance.render(parsedData);
          }
        } else {
          // Display an alert if 'editor-content.json' is not found
          alert("The 'editor-content.json' file was not found in the ZIP archive.");
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  const exportHTML = async () => {
    setexport(false); // Close the submenu
  
    const savedData = await editorInstance.save();
    const html = edjsHTML ().parse(savedData)
    const link = document.createElement('a');
    const blob = new Blob([html], { type: 'text/html' });
    link.href = URL.createObjectURL(blob);
    link.download = 'editor-content.html';
    link.click();
  };
  
  

  return (
    <main className='bg-white h-screen'>
      
      <nav className='nav'>
        <h1 className='title'>WebDesigner Tool</h1>
        <div className='flex'>
          {/* Export button with submenu */}
          <div className='export-container'>
            <label
              className='export-btn'
              onClick={() => setexport(!exportpop)}
            >
              Export
            </label>
            {exportpop && (
              <div className='export-menu'>
              <button onClick={() => exportHTML()} className='export-option'>
                Export as HTML
              </button>
              
              {/* Add more export options here */}
              </div>
            
            )}
          </div>
          <label className='import-btn'>
            Import
            <input type='file' onChange={handleImport} style={{ display: 'none' }} accept='.zip'/>
          </label>
        </div>
      </nav>
      <section>
        <div ref={editorContainerRef}></div>
      </section>
    
      
      
    </main>
  );
};

export default Home;
