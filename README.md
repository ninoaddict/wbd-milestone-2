# LinkedPurry

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Contributors](#contributors)
6. [Pembagian Tugas](#pembagian-tugas)

---

## Project Overview

LinkedPurry adalah sebuah platform yang dirancang agar para pencari kerja dapat dengan mudah melakukan komunikasi dengan pencari kerja lainnya. Pencari kerja juga bisa melakukan posting yang bisa dilihat ke publik. Pencari kerja bisa menjadi teman atau melakukan koneksi ke pencari-pencari kerja lainnya.

---

## Features

1. Home Page
![Home Page](/lighthouse_pics/welcome_page_lighthouse.png)

2. Login and Register (Authentication)
![Login and Register (Authentication)](/lighthouse_pics/login_page_lighthouse.png)
![Login and Register (Authentication)](/lighthouse_pics/register_page_lighthouse.png)

3. User Lists
![User Lists](/lighthouse_pics/user_list_lighthouse.png)

4. Connection Requests
![Connection Requests](/lighthouse_pics/connection_request_lighthouse.png)

5. Connection Lists
![Connection Lists](/lighthouse_pics/connection_list_lighthouse.png)

6. Feeds
![Feeds](/lighthouse_pics/feed_page_lighthouse.png)

7. Chats
![Chats](/lighthouse_pics/chat_header_lighthouse.png)
![Chats](/lighthouse_pics/chat_page_lighthouse.png)

8. Profile Page
![Profile Page](/lighthouse_pics/profile_page_lighthouse.png)

9. Notification

10. Load Test

- Load test profile
![Load Test](/load_test/load_test_profile.png)

- Load test feed
![Load test profile](/load_test/load_test_feed.png)
---

11. Typing indicator (Bonus)
![Typing indicator](/lighthouse_pics/typing_indicator.png)

12. UI Mirip Linkedin (Bonus)

13. Google Lighthouse (Bonus)

14. Connection Recommendation (Bonus)

![Connection recommendation](/lighthouse_pics/job_recommendation.png)

## Tech Stack

Program ini menggunakan Tech Stack sebagai berikut

- **Programming Language**: Typescript
- **Framework**: React, Express, Vite
- **Database**: PostgreSQL

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Labpro-21/if-3310-2024-2-k02-21.git
   cd if-3310-2024-2-k02-21

2. Jalankan program dengan _command_
```bash
docker compose up
```

3. Buka localhost:5173 pada browser Anda untuk melihat website ini

4. Jika ingin memberhentikan program ini, jalankan _command_ berikut
```bash
docker compose down
```

5. Atau jika Anda juga ingin sekalian menghapus volume yang berisi _database_, jalankan _command_ berikut
```bash
docker compose down -v
```

## Contributors
<table>
  <tr>
    <th>Nama</th>
    <th>NIM</th>
    <th>Email</th>
    <th>Github</th>
  </tr>
  <tr>
    <th>Fabian Radenta Bangun</th>
    <th>13522105</th>
    <th>
      <a href="mailto:13522105@std.stei.itb.ac.id">13522105@std.stei.itb.ac.id</a>
    </th>
    <th>
      <a href="https://github.com/fabianradenta">
        fabianradenta
      </a>
    </th>
  </tr>
  <tr>
    <th>Marvin Scifo Y. Hutahaean</th>
    <th>13522110</th>
    <th>
      <a href="mailto:13522110@std.stei.itb.ac.id">13522110@std.stei.itb.ac.id</a>
    </th>
    <th>
      <a href="https://github.com/scifo04">
        scifo04
      </a>
    </th>
  </tr>
  <tr>
    <th>Adril Putra Merin</th>
    <th>13522068</th>
        <th>
      <a href="mailto:13522068@std.stei.itb.ac.id">13522068@std.stei.itb.ac.id</a>
    </th>
    <th>
      <a href="https://github.com/ninoaddict">
        ninoaddict
      </a>
    </th>
  </tr>
</table>

## Pembagian Tugas
| 13522068                                 | 13522105    | 13522110                |
| ---------------------------------------- | ----------- | ----------------------- |
| Set up project architecture              | Login       | Connection Pages        |
| Set up database                          | Register    | Feed Page (Homepage)    |
| Set up base class and functions          |             | Welcome Page (Homepage) |
| Set up docker                            |             | API Documentation       |
| Profile Page                             |             | Readme                  |
| Chat Page                                |             |                         |
| Notification                             |             |                         |
| Program Refactorings                     |             |                         |
| Stress & Load Test                       |             |                         |
| Login                       |             |                         |
| Register                       |             |                         |
| Feed Page                      |             |                         |
| Connection Pages                      |             |                         |
| Typing indicator (Bonus)                      |             |                         |
| Connection recommendation (Bonus)                   |             |                         |
