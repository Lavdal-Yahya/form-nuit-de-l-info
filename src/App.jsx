import { useState, useEffect } from 'react'
import FloatingParticles from './components/FloatingParticles'
import CustomCursor from './components/CustomCursor'
import './App.css'

const WORK_AREAS = [
  { id: 'frontend', label: 'Front-end' },
  { id: 'backend', label: 'Back-end' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'deployment', label: 'Deployment' },
]

const TECHNOLOGIES = [
  'Django',
  'Django REST',
  'React',
  'Next.js',
  'Spring',
  'NestJS',
  'Laravel',
  'Vue.js',
  'Angular',
  'Express.js',
  'FastAPI',
  'Flask',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'PHP',
]

function App() {
  const [formData, setFormData] = useState({
    matricule: '',
    name: '',
    workArea: '',
    technologies: [],
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedMatricules, setSubmittedMatricules] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Load submitted matricules from localStorage
    const stored = localStorage.getItem('submittedMatricules')
    if (stored) {
      setSubmittedMatricules(JSON.parse(stored))
    }

    // Track mouse position for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleWorkAreaChange = (areaId) => {
    setFormData((prev) => ({
      ...prev,
      workArea: prev.workArea === areaId ? '' : areaId,
    }))
    setError('')
  }

  const handleTechnologyToggle = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    // Validation
    if (!formData.matricule.trim()) {
      setError('Please enter your matricule')
      setIsSubmitting(false)
      return
    }

    if (!formData.name.trim()) {
      setError('Please enter your name')
      setIsSubmitting(false)
      return
    }

    if (!formData.workArea) {
      setError('Please select a work area')
      setIsSubmitting(false)
      return
    }

    if (formData.technologies.length === 0) {
      setError('Please select at least one technology')
      setIsSubmitting(false)
      return
    }

    // Check for duplicate matricule (local check)
    const matriculeUpper = formData.matricule.trim().toUpperCase()
    if (submittedMatricules.includes(matriculeUpper)) {
      setError('This matricule has already been submitted')
      setIsSubmitting(false)
      return
    }

    // Prepare submission
    const submission = {
      ...formData,
      matricule: matriculeUpper,
      submittedAt: new Date().toISOString(),
    }

    // Get Google Script URL from environment variable
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL

    // Send to Google Sheets if URL is configured
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script requires no-cors
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        })
        // Note: With no-cors mode, we can't read the response
        // The Google Apps Script will handle duplicate checking server-side
      } catch (err) {
        console.error('Error submitting to Google Sheets:', err)
        // Continue anyway - we'll still save locally as backup
        // User will see success message, data saved to localStorage
      }
    }

    // Store in localStorage as backup
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]')
    submissions.push(submission)
    localStorage.setItem('submissions', JSON.stringify(submissions))

    // Update submitted matricules
    const updatedMatricules = [...submittedMatricules, matriculeUpper]
    setSubmittedMatricules(updatedMatricules)
    localStorage.setItem('submittedMatricules', JSON.stringify(updatedMatricules))

    // Reset form
    setFormData({
      matricule: '',
      name: '',
      workArea: '',
      technologies: [],
    })

    setSuccess(true)
    setIsSubmitting(false)
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="app">
      <CustomCursor mousePosition={mousePosition} />
      <FloatingParticles />
      <div 
        className="container"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
        }}
      >
        <div className="header">
          <div className="title-wrapper">
            <h1 className="main-title">
              <span className="title-gradient">Nuit de l'Info</span>
            </h1>
            <div className="title-underline"></div>
          </div>
          <p className="subtitle">Join the Innovation Journey</p>
          <div className="header-decoration">
            <div className="decoration-dot"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-dot"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="matricule">Matricule *</label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleInputChange}
              placeholder="Enter your matricule"
              className={error && !formData.matricule ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={error && !formData.name ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>What do you want to work on? *</label>
            <div className="work-areas">
              {WORK_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleWorkAreaChange(area.id)}
                  className={`work-area-btn ${
                    formData.workArea === area.id ? 'active' : ''
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Technologies you know *</label>
            <div className="technologies-grid">
              {TECHNOLOGIES.map((tech) => (
                <label key={tech} className="technology-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.technologies.includes(tech)}
                    onChange={() => handleTechnologyToggle(tech)}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="message error-message">{error}</div>}
          {success && (
            <div className="message success-message">
              ✓ Form submitted successfully!
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App

