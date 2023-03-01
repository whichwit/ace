# Ace Health Appointment Scheduler

Demo link: https://whichwit.github.io/ace

## Implementation
- In addition to Angular and its dependencies (including Material), NgRx is used for state management, Tailwind CSS is used for styling, and Lodash is used for convenience.
- Angular's stock HttpClient is used to interact with FHIR end points.
- Firely Server (https://server.fire.ly) is an open R4 server targetted by the demo. 
  * Authentication and authorization implemention intentionally skipped. 
  * Capability Statement can be referenced [here](https://server.fire.ly/r4/CapabilityStatement).
  * Comformance level unknown e.g. narratives are not always returned with each resource entry.
- FHIR resources involved: Patient, HealthcareService, Schedule, Slot, Appointment
- Hard-coded organization id: `63139517-6bba-4376-aac7-c8847bc9ca9a`