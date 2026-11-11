# AgroPulse AI: Backend REST API Documentation

Base URL: `http://localhost:5000/api` (or production host)

All non-health endpoints require the standard header:
```http
Authorization: Bearer <Supabase_JWT_Token>
```

---

## 1. System Endpoints

### `GET /health`
Returns system health, timestamp, and active service name.
- **Authentication**: None
- **Response `200`**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-11-06T12:00:00.000Z",
    "service": "AgroPulse Crop Advisory Backend"
  },
  "message": "Server is healthy and ready"
}
```

---

## 2. Farmer Profile Endpoints

### `GET /profile`
Retrieves the authenticated farmer's land and soil profile.
- **Response `200`**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "full_name": "Ramesh Gowda",
    "phone": "9876543210",
    "state": "Karnataka",
    "district": "Mandya",
    "village": "Maddur",
    "preferred_language": "kn",
    "farming_experience_years": 12,
    "farm_area": 3.5,
    "farm_area_unit": "acres",
    "soil_type": "Red Soil (ಕೆಂಪು ಮಣ್ಣು)",
    "irrigation_type": "Drip Irrigation (ಹನಿ ನೀರಾವರಿ)",
    "farming_type": "Sugarcane and Vegetables"
  }
}
```

### `PUT /profile`
Updates farmer profile metadata.
- **Body**: Same as fields in profile.
- **Response `200`**: Updated profile object.

---

## 3. Advisory Inference Endpoints

### `POST /advisory/crop-recommendation`
Generates top recommended crops using Google Gemini with structured output.
- **Request Body**:
```json
{
  "state": "Karnataka",
  "district": "Mandya",
  "season": "Kharif",
  "soilType": "Red Soil (ಕೆಂಪು ಮಣ್ಣು)",
  "soilPh": 6.8,
  "farmArea": 2.5,
  "areaUnit": "acres",
  "waterAvailability": "Borewell 4 hours daily",
  "irrigationMethod": "Drip",
  "farmingObjective": "High commercial return",
  "budget": "Standard",
  "preferredLanguage": "en"
}
```
- **Response `201`**: Returns newly created `advisories` row with `result_data` adhering to `CropRecommendationResponseSchema`.

---

### `POST /advisory/disease-detection`
Multimodal plant leaf photo diagnostic scanner.
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `image`: File (JPEG, PNG, WebP up to 5MB)
  - `cropName`: String (e.g. `Tomato`)
  - `symptoms`: String (e.g. `Yellow spots with brown concentric rings`)
  - `growthStage`: String (e.g. `Flowering`)
  - `location`: String (e.g. `Mandya, Karnataka`)
  - `preferredLanguage`: `en` or `kn`
- **Response `201`**:
```json
{
  "success": true,
  "data": {
    "advisory": { "id": "...", "title": "Tomato Health Diagnosis: Early Blight" },
    "diseaseAnalysis": { "id": "...", "image_path": "user-id/filename.jpg" },
    "imageUrl": "https://storage-signed-url...",
    "result": {
      "cropName": "Tomato",
      "imageQuality": "good",
      "assessmentStatus": "possible_match",
      "possibleConditions": [
        {
          "name": "Early Blight (Alternaria solani)",
          "likelihood": "high",
          "symptoms": ["Dark brown circular lesions with concentric rings", "Lower foliage yellowing"],
          "possibleCauses": ["Warm humid weather", "Overhead watering splashing soil spores"]
        }
      ],
      "recommendedActions": [
        "Prune and burn lower infected leaves immediately",
        "Avoid overhead irrigation to keep foliage dry"
      ],
      "preventiveMeasures": [
        "Maintain minimum 60cm row spacing for canopy aeration",
        "Apply organic mulch around plant base to prevent rain splash"
      ],
      "safetyWarnings": [
        "If applying Mancozeb or Copper Oxychloride, observe mandatory 7-day pre-harvest interval (PHI) and wear gloves and mask."
      ],
      "expertConsultationRecommended": false,
      "limitations": [
        "Visual assessment only. Severe bacterial cankers require laboratory culture confirmation."
      ]
    }
  }
}
```

---

### `POST /advisory/fertilizer`
Calculates split fertilizer doses, organic manures, and precautions.
- **Request Body**:
```json
{
  "crop": "Paddy",
  "growthStage": "Tillering (30 DAS)",
  "soilType": "Alluvial Soil",
  "farmArea": 2,
  "areaUnit": "acres",
  "soilPh": 7.0,
  "existingFertilizer": "DAP at sowing",
  "preferredLanguage": "en"
}
```
- **Response `201`**: Structured split schedule.

---

### `POST /advisory/irrigation`
Generates watering intervals, moisture monitoring, and water conservation guidance.
- **Request Body**:
```json
{
  "crop": "Sugarcane",
  "growthStage": "Formative Stage",
  "soilType": "Black Soil",
  "farmArea": 3,
  "areaUnit": "acres",
  "irrigationMethod": "Drip Irrigation",
  "waterAvailability": "Canal water scheduled once a week",
  "recentRainfall": "Light showers 3 days ago",
  "preferredLanguage": "kn"
}
```
- **Response `201`**: Structured water plan.

---

## 4. 24/7 AI Farming Assistant Endpoints

### `POST /assistant/chat`
Ask agricultural questions with conversation memory and profile context.
- **Request Body**:
```json
{
  "conversationId": "optional-uuid",
  "message": "Why are my chilli plants dropping flowers?",
  "preferredLanguage": "en",
  "farmerContext": { "district": "Hassan", "soil": "Red Soil" }
}
```
- **Response `200`**:
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid-here",
    "answer": "Flower drop in chilli is typically triggered by high temperature fluctuations, irregular watering during blossom, or nitrogen excess...",
    "followUpQuestions": [
      "What is your day and night temperature currently?",
      "Are you applying high nitrogen fertilizer right now?"
    ],
    "warnings": [],
    "needsMoreInformation": true
  }
}
```

### `GET /assistant/conversations`
List all user chat sessions.

### `GET /assistant/conversations/:id/messages`
List all user and assistant messages for a chat session.

### `DELETE /assistant/conversations/:id`
Delete chat session.

---

## 5. History & Account Endpoints

### `GET /history?page=1&limit=10&type=crop_recommendation`
Paginated advisory records.

### `GET /history/:id`
Detailed single advisory payload with fresh signed URLs for images.

### `DELETE /history/:id`
Permanent deletion of an advisory record.

### `DELETE /account`
Permanently purges authenticated user's profile, files in Supabase Storage, and Auth record.

