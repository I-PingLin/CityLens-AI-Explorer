
import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landmark-result',
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
      <!-- Image & AR Layer -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl group h-[400px] lg:h-auto min-h-[500px]">
        <img [src]="image()" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Landmark">
        
        <!-- AR HUD -->
        <div class="absolute inset-0 ar-overlay p-8 flex flex-col justify-end">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-sky-500/20">
              <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Live Landmark Analysis
            </div>
            
            <div>
              <h2 class="text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
                {{ data().name }}
              </h2>
              <div class="flex items-center gap-4 text-sky-200">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ data().location }}
                </span>
                @if (data().yearBuilt) {
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Est. {{ data().yearBuilt }}
                  </span>
                }
              </div>
            </div>

            <button 
              (click)="toggleAudio()"
              class="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all border border-white/20 group/btn">
              <div class="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/40">
                @if (isNarrating()) {
                   <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                } @else {
                   <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                }
              </div>
              <div class="text-left">
                <div class="text-sm font-bold text-white">{{ isNarrating() ? 'Pause Tour' : 'Play Guided Tour' }}</div>
                <div class="text-[10px] text-sky-200 uppercase tracking-widest font-semibold">AI Narrated Clip</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="space-y-6 overflow-y-auto max-h-[600px] lg:max-h-none pr-2">
        <div class="glass p-8 rounded-3xl border-slate-700/50">
          <h3 class="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Historical Record
          </h3>
          <div class="prose prose-invert text-slate-300 leading-relaxed whitespace-pre-wrap">
            {{ data().narrative }}
          </div>
        </div>

        @if (data().sources && data().sources.length > 0) {
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Verification Sources</h4>
            @for (source of data().sources; track source.uri) {
              <a [href]="source.uri" target="_blank" class="block glass p-4 rounded-2xl border-slate-700/30 hover:bg-slate-800 transition-colors group">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sky-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{{ source.title || 'Official Archive' }}</p>
                      <p class="text-[10px] text-slate-500 truncate max-w-[200px]">{{ source.uri }}</p>
                    </div>
                  </div>
                  <svg class="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class LandmarkResultComponent {
  data = input.required<any>();
  image = input.required<string>();
  close = output<void>();

  isNarrating = signal(false);
  private synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    effect(() => {
      if (this.data()) {
        this.setupSpeech();
      }
    });
  }

  setupSpeech() {
    if (!this.synthesis) return;
    
    // Clean up previous
    this.synthesis.cancel();
    
    this.utterance = new SpeechSynthesisUtterance(this.data().narrative);
    this.utterance.rate = 1.0;
    this.utterance.pitch = 1.0;
    
    this.utterance.onend = () => {
      this.isNarrating.set(false);
    };
  }

  toggleAudio() {
    if (!this.synthesis || !this.utterance) return;

    if (this.isNarrating()) {
      this.synthesis.pause();
      this.isNarrating.set(false);
    } else {
      if (this.synthesis.paused) {
        this.synthesis.resume();
      } else {
        this.synthesis.speak(this.utterance);
      }
      this.isNarrating.set(true);
    }
  }

  ngOnDestroy() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
