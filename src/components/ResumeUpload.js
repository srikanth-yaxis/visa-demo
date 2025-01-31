import React, { useState } from "react";
import {
  Container,
  Button,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Dialog,
} from "@mui/material";
import { Delete, UploadFile, LinkedIn, Close } from "@mui/icons-material";
import * as pdfjs from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import linkedInImage from "../assets/07.png"

// Set PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeUpload = () => {
  const [skills, setSkills] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State for LinkedIn popup

  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      let extractedText = "";

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(arrayBuffer);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        extractedText = await extractTextFromDOCX(arrayBuffer);
      } else if (file.type === "text/plain") {
        extractedText = new TextDecoder().decode(arrayBuffer);
      } else {
        alert("Only PDF, DOCX, DOC, and TXT files are supported.");
        setUploading(false);
        return;
      }

      extractSkills(extractedText);
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const extractTextFromPDF = async (arrayBuffer) => {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const extractTextFromDOCX = async (arrayBuffer) => {
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const extractSkills = (text) => {
    console.log("Extracted Text:", text); // Debugging log

    // Extract skills from structured skill sections
    const skillPattern = /Skills\s*:\s*([\s\S]*)/gi;
    const match = skillPattern.exec(text);

    if (match) {
      const extracted = match[1]
        .split(/[-•\n]/) // Split by dashes, bullets, or new lines
        .map(skill => skill.replace(/^[^\w]+/, "").trim()) // Clean up leading symbols
        .filter(skill => skill.length > 1); // Remove empty entries

      console.log("Parsed Skills:", extracted); // Debugging log
      setSkills(extracted);
    } else {
      alert("Could not find a 'Skills' section.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          1/10 Create your profile • 5-10 min
        </Typography>

        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          How would you like to tell us about yourself?
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          We need to get a sense of your education, experience, and skills.
          It’s quickest to import your information—you can edit it before your profile goes live.
        </Typography>

        {/* Import from LinkedIn Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LinkedIn />}
          sx={{
            border: "2px solid green",
            color: "green",
            mb: 2,
            py: 1.5,
            fontWeight: "bold",
          }}
          onClick={() => setOpenModal(true)} // Open modal on click
        >
          Import from LinkedIn
        </Button>

        {/* Upload Resume Button */}
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="outlined"
            fullWidth
            component="span"
            startIcon={<UploadFile />}
            sx={{
              border: "2px solid green",
              color: "green",
              mb: 2,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Upload your resume
          </Button>
        </label>

        {/* Fill Out Manually Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "2px solid green",
            color: "green",
            py: 1.5,
            fontWeight: "bold",
          }}
          onClick={() => alert("Manual Input Coming Soon!")}
        >
          Fill out manually (5 min)
        </Button>

        {uploading && <LinearProgress sx={{ mt: 2 }} />}

        {/* Display Extracted Skills */}
        {skills.length > 0 && (
          <Box sx={{ mt: 4, textAlign: "left" }}>
            <Typography variant="h6">Extracted Skills:</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => setSkills(skills.filter((_, i) => i !== index))}
                  deleteIcon={<Delete />}
                  sx={{ fontSize: 14, p: 1, bgcolor: "#e3f2fd" }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* LinkedIn Upload Image Popup */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8, background: "white" }}
          onClick={() => setOpenModal(false)}
        >
          <Close />
        </IconButton>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
          <img src={linkedInImage} alt="LinkedIn Upload Instructions" style={{ width: "100%", borderRadius: "10px" }} />
        </Box>
      </Dialog>
    </Container>
  );
};

export default ResumeUpload;
