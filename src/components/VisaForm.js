import { useState } from "react"
import {
  Container,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import Select from "react-select"
import { useForm, Controller } from "react-hook-form"
import { countries, visaTypes } from "../data/visaData"
import { useNavigate } from "react-router-dom"; // 🚀 For navigation

import logo from "../assets/Y-Axis-Jobs-Logo.png"

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const relocationTimings = [
  { label: "Immediate", value: "immediate" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "3 Months", value: "3_months" },
  { label: "6 Months", value: "6_months" },
  { label: "Not Sure", value: "not_sure" },
]

const VisaForm = () => {
  const { control, handleSubmit, watch } = useForm()
  const [workVisaCountries, setWorkVisaCountries] = useState([])
  const [visaDetails, setVisaDetails] = useState({})
  const [visaExpiryDates, setVisaExpiryDates] = useState({})
  const [needsSponsorship, setNeedsSponsorship] = useState("no")
  const [showSummary, setShowSummary] = useState(false)
  const [summaryText, setSummaryText] = useState("")

  const navigate = useNavigate(); // 🚀 Use navigate for redirection


  const livedOverseas = watch("livedOverseas", "no")
  const workAuthorization = watch("workAuthorization", "")
  const willingToRelocate = watch("willingToRelocate", "no")
  // const interestedInRemoteWork = watch("interestedInRemoteWork", "no")

  const handleVisaChange = (country, visa) => {
    setVisaDetails((prev) => ({ ...prev, [country]: visa }))
  }

  const handleExpiryDateChange = (country, date) => {
    setVisaExpiryDates((prev) => ({ ...prev, [country]: date }))
  }

  const onSubmit = (data) => {
    const summaryText = generateSummaryText(data)
    setSummaryText(summaryText)
    setShowSummary(true)
  }

  const generateSummaryText = (data) => {
    const summary = []

    summary.push(`You have ${data.livedOverseas === "yes" ? "" : "not "}lived overseas.`)

    if (data.livedOverseas === "yes" && data.countriesLivedIn.length > 0) {
      summary.push(`You have lived in ${data.countriesLivedIn.map((c) => c.label).join(", ")}.`)
    }

    summary.push(`Your work authorization status is: ${data.workAuthorization}.`)

    if (data.workAuthorization === "authorized" && workVisaCountries.length > 0) {
      summary.push(
        `You hold work visas for: ${workVisaCountries
          .map((country) => {
            const countryName = countries.find((c) => c.value === country)?.label
            const visaType = visaDetails[country]
            const expiryDate = visaExpiryDates[country]
            return `${countryName} (${visaType}, expires on ${expiryDate})`
          })
          .join("; ")}.`,
      )
    }

    if (data.preferredWorkLocations && data.preferredWorkLocations.length > 0) {
      summary.push(`Your preferred work locations are: ${data.preferredWorkLocations.map((c) => c.label).join(", ")}.`)
    }

    summary.push(`You ${needsSponsorship === "yes" ? "require" : "do not require"} employer sponsorship.`)
    summary.push(`You are ${data.willingToRelocate === "yes" ? "" : "not "}willing to relocate.`)

    if (data.willingToRelocate === "yes" && data.relocationTiming) {
      summary.push(`Your planned relocation timing is: ${data.relocationTiming.label}.`)
    }

    summary.push(`You are ${data.interestedInRemoteWork === "yes" ? "" : "not "}interested in remote work.`)

    return summary.join("\n")
  }

  const getFlagUrl = (countryCode) => {
    const lowercaseCode = countryCode.toLowerCase()
    return `https://flagcdn.com/w40/${lowercaseCode}.png`
  }

  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={getFlagUrl(data.value) || "/placeholder.svg"}
        alt=""
        style={{ width: 20, height: 15, marginRight: 10 }}
      />
      {data.label}
    </div>
  )

  const customMultiValue = ({ data, removeProps }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        borderRadius: "2px",
        padding: "2px 5px",
        margin: "2px",
      }}
    >
      <img
        src={getFlagUrl(data.value) || "/placeholder.svg"}
        alt=""
        style={{ width: 16, height: 12, marginRight: 5 }}
      />
      {data.label}
      <span
        style={{ marginLeft: 5, cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={removeProps.onClick}
      >
        <CrossIcon />
      </span>
    </div>
  )

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props
    return (
      <div ref={innerRef} {...innerProps} style={{ display: "flex", alignItems: "center", padding: 10 }}>
        <img
          src={getFlagUrl(data.value) || "/placeholder.svg"}
          alt=""
          style={{ width: 20, height: 15, marginRight: 10 }}
        />
        {data.label}
      </div>
    )
  }

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
        <img src={logo || "/placeholder.svg"} alt="Y-Axis Jobs Logo" style={{ width: 150, height: "auto" }} />
      </Box>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Visa Information
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Have you lived overseas?</FormLabel>
                <Controller
                  name="livedOverseas"
                  control={control}
                  defaultValue="no"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {livedOverseas === "yes" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Countries you have lived in</FormLabel>
                  <Controller
                    name="countriesLivedIn"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countries}
                        isMulti
                        components={{
                          SingleValue: customSingleValue,
                          Option: customOption,
                          MultiValue: customMultiValue,
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "56px",
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                          }),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Work Authorization Status</FormLabel>
                <Controller
                  name="workAuthorization"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="authorized" control={<Radio />} label="I am authorized to work" />
                      <FormControlLabel value="noVisa" control={<Radio />} label="I don't have a visa" />
                      <FormControlLabel value="inProcess" control={<Radio />} label="Visa in process" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {workAuthorization === "authorized" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Countries where you hold a work visa</FormLabel>
                  <Controller
                    name="workVisaCountries"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countries}
                        isMulti
                        components={{
                          SingleValue: customSingleValue,
                          Option: customOption,
                          MultiValue: customMultiValue,
                        }}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions)
                          setWorkVisaCountries(selectedOptions.map((option) => option.value))
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "56px",
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                          }),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            {workVisaCountries.length > 0 &&
              workVisaCountries.map((country) => (
                <Grid item xs={12} key={country}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <FormLabel sx={{ fontWeight: 600 }}>
                      Visa Details for {countries.find((c) => c.value === country)?.label}
                    </FormLabel>
                    <Box display="flex" gap={2}>
                      <Select
                        value={
                          visaDetails[country] ? { label: visaDetails[country], value: visaDetails[country] } : null
                        }
                        options={visaTypes[country]?.map((visa) => ({ label: visa, value: visa })) || []}
                        onChange={(selected) => handleVisaChange(country, selected.value)}
                        placeholder="Select Visa Type"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "56px",
                            width: "200px",
                          }),
                        }}
                      />
                      {visaDetails[country] && (
                        <TextField
                          label="Visa Expiry Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={visaExpiryDates[country] || ""}
                          onChange={(e) => handleExpiryDateChange(country, e.target.value)}
                          sx={{ width: "200px" }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Preferred Work Locations</FormLabel>
                <Controller
                  name="preferredWorkLocations"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countries}
                      isMulti
                      components={{
                        SingleValue: customSingleValue,
                        Option: customOption,
                        MultiValue: customMultiValue,
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "56px",
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Do you require employer sponsorship?</FormLabel>
                <Controller
                  name="needsSponsorship"
                  control={control}
                  defaultValue="no"
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Ensure React Hook Form updates the value
                        setNeedsSponsorship(e.target.value); // Update local state
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Are you willing to relocate?</FormLabel>
                <Controller
                  name="willingToRelocate"
                  control={control}
                  defaultValue="no"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {willingToRelocate === "yes" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>When do you plan to relocate?</FormLabel>
                  <Controller
                    name="relocationTiming"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={relocationTimings}
                        placeholder="Select Timing"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "56px",
                          }),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Are you interested in remote work?</FormLabel>
                <Controller
                  name="interestedInRemoteWork"
                  control={control}
                  defaultValue="no"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
                Save & Continue
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
       {/* Summary Dialog */}
       <Dialog open={showSummary} onClose={() => setShowSummary(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Visa Information Summary</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{summaryText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummary(false)} color="primary">
            Close
          </Button>
          <Button
            onClick={() => navigate("/resume-upload")} // 🚀 Navigate to the next page
            variant="contained"
            color="primary"
          >
            Proceed
          </Button>
        </DialogActions>
      
      </Dialog>
    </Container>
  )
}

export default VisaForm

