
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from './services/gemini.service';
import { CameraComponent } from './components/camera.component';
import { LandmarkResultComponent } from './components/landmark-result.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CameraComponent, LandmarkResultComponent],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  private geminiService = inject(GeminiService);

  readonly appState = signal<'idle' | 'analyzing' | 'result' | 'error'>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly currentImage = signal<string | null>(null);
  readonly landmarkData = signal<any>(null);

  async onPhotoCaptured(base64Image: string) {
    this.currentImage.set(base64Image);
    this.appState.set('analyzing');
    this.errorMessage.set(null);

    try {
      // Step 1: Identify the landmark
      const identification = await this.geminiService.identifyLandmark(base64Image);
      
      if (!identification || identification.name === 'unknown') {
        throw new Error("We couldn't identify this landmark. Try a clearer angle!");
      }

      // Step 2: Fetch deep history and narrated script with Search Grounding
      const details = await this.geminiService.getLandmarkDetails(identification.name);
      
      this.landmarkData.set({
        ...identification,
        ...details
      });
      
      this.appState.set('result');
    } catch (err: any) {
      console.error(err);
      this.errorMessage.set(err.message || 'An unexpected error occurred.');
      this.appState.set('error');
    }
  }

  reset() {
    this.appState.set('idle');
    this.landmarkData.set(null);
    this.currentImage.set(null);
  }
}
