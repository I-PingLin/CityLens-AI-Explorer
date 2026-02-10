
import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  imports: [CommonModule],
  template: `
    <div class="relative group cursor-pointer w-full max-w-sm">
      <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <label class="relative flex flex-col items-center justify-center w-full aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl hover:border-sky-500 transition-all cursor-pointer">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <div class="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p class="mb-2 text-lg font-bold text-white">Snap or Upload</p>
          <p class="text-sm text-slate-500">Capture a photo to start the tour</p>
        </div>
        <input type="file" class="hidden" accept="image/*" capture="environment" (change)="onFileSelected($event)" />
      </label>
    </div>
  `,
  styles: []
})
export class CameraComponent {
  photoTaken = output<string>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoTaken.emit(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
