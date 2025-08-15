import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <header>
        <div class="logo"></div>
        <nav class="menu">
          <ul>
            <li><a href="#" class="active">Home</a></li>
            <li><a href="#">Destinations</a></li>
            <li><a href="#">Bookings</a></li>
            <li><a href="#">Profile</a></li>
          </ul>
        </nav>
      </header>

      <section class="hero">
        <h1>Discover Amazing Places in Europe</h1>
        <p>
          Find the best destinations and experiences for your next adventure
        </p>

        <div class="search-container">
          <input
            type="text"
            placeholder="Where would you like to go?"
            class="search-input"
          />
          <button class="search-button">Search</button>
        </div>
      </section>

      <section class="featured">
        <h2>Featured Destinations</h2>
        <div class="destination-grid">
          <div class="destination-card">
            <div class="destination-image paris"></div>
            <h3>Paris</h3>
            <p>The City of Light</p>
          </div>
          <div class="destination-card">
            <div class="destination-image rome"></div>
            <h3>Rome</h3>
            <p>The Eternal City</p>
          </div>
          <div class="destination-card">
            <div class="destination-image barcelona"></div>
            <h3>Barcelona</h3>
            <p>Catalonian Wonder</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
