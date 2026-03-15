Here is a **clean `README.md` file** you can directly paste into your repository. No YAML, just the actual README content.

---

# PassScope 🔐

**PassScope** is a lightweight client-side password strength analyzer that evaluates the security of a password in real time. It provides a strength score, estimated crack time, and suggestions to help users create stronger passwords.

The application runs entirely in the browser and does **not store or transmit any passwords**.

---

## Features

* Real-time password strength analysis
* Security score from **0 – 100**
* Visual password strength meter
* Estimated **brute-force crack time**
* Hack probability estimate
* Password improvement suggestions
* Entropy-based password complexity calculation
* Fully client-side processing (privacy focused)
* Simple and responsive UI

---

## Password Strength Logic

PassScope calculates password strength using a heuristic scoring model.

### Scoring Bonuses

| Condition                   | Points |
| --------------------------- | ------ |
| Length ≥ 12 characters      | +20    |
| Length ≥ 8 characters       | +10    |
| Contains uppercase letters  | +10    |
| Contains lowercase letters  | +10    |
| Contains numbers            | +10    |
| Contains special characters | +10    |

### Penalties

| Condition                 | Points |
| ------------------------- | ------ |
| Repeated characters       | -10    |
| Common passwords detected | -15    |
| Dictionary words detected | -10    |
| Low character uniqueness  | -10    |

### Final Score

```
Final Score = Bonuses − Penalties
Range: 0 – 100
```

Strength levels:

| Score    | Strength    |
| -------- | ----------- |
| 0 – 19   | Very Weak   |
| 20 – 39  | Weak        |
| 40 – 59  | Moderate    |
| 60 – 79  | Strong      |
| 80 – 100 | Very Strong |

---

## Entropy Calculation

Password entropy estimates the theoretical difficulty of brute-force attacks.

```
Entropy = PasswordLength × log₂(CharacterSetSize)
```

Character set size depends on the characters used:

* Lowercase letters
* Uppercase letters
* Numbers
* Special characters

---

## Crack Time Estimation

PassScope estimates brute-force crack time using:

```
TimeToCrack = (2^Entropy) / (GuessesPerSecond × 2)
```

Assumption:

```
GuessesPerSecond ≈ 10^10
```

This represents a modern GPU password-guessing rate.

---

## Tech Stack

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**

No frameworks or external libraries are used.

---

## Project Structure

```
PassScope
│
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## Running Locally

1. Clone the repository

```
git clone https://github.com/AtharvS7/PassScope.git
```

2. Navigate to the project folder

```
cd PassScope
```

3. Open the application

Simply open **index.html** in your browser.

---

## Deployment

PassScope is a **fully static website**, so it can be deployed easily on:

* **Vercel**
* **Netlify**
* **GitHub Pages**

### Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import the **PassScope** repository
4. Click **Deploy**

The site will be live instantly.

---

## Privacy

All password analysis happens **locally in the browser**.

* No passwords are stored
* No passwords are transmitted
* No backend services are used

---

## Author

**Atharv Sawane**

GitHub:
[https://github.com/AtharvS7](https://github.com/AtharvS7)

