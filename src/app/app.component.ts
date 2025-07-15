import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ChangeDetectorRef,
  Component,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Monty Hall Demonstration';

  cdRef = inject(ChangeDetectorRef);

  doorCount = model<number>(3);
  roundCount = model<number>(10000);
  results = model<string[]>([]);

  roundsPlayed = signal<number>(0);
  changeWinCount = signal<number>(0);
  keepWinCount = signal<number>(0);

  startButton = viewChild.required<MatButton>('startButton');

  onBlurDoorCount() {
    if (this.doorCount() < 3) {
      this.doorCount.set(3);
    }
  }

  onBlurRoundCount() {
    if (this.roundCount() < 1) {
      this.roundCount.set(1000);
    }
  }

  startGame() {
    this.startButton().disabled = true;
    if (this.doorCount() < 3) {
      this.doorCount.set(3);
    }
    if (this.roundCount() < 1) {
      this.roundCount.set(1000);
    }
    this.roundsPlayed.set(0);
    this.changeWinCount.set(0);
    this.keepWinCount.set(0);
    this.results.set([]);
    // Trigger change detection to update the DOM
    this.cdRef.detectChanges();

    // Use setTimeout to delay the start of the for loop
    setTimeout(() => {
      const doorCount = this.doorCount();
      for (let i = 0; i < this.roundCount(); i++) {
        const winningDoor = Math.floor(Math.random() * doorCount) + 1;
        const firstChoice = Math.floor(Math.random() * doorCount) + 1;

        if (firstChoice === winningDoor) {
          this.keepWinCount.set(this.keepWinCount() + 1);
          this.results.set([
            ...this.results(),
            `Player chooses door ${firstChoice}; Winning door: ${winningDoor}; Staying wins`,
          ]);
        } else {
          this.changeWinCount.set(this.changeWinCount() + 1);
          this.results.set([
            ...this.results(),
            `Player chooses door ${firstChoice}; Winning door: ${winningDoor}; Changing wins`,
          ]);
        }
        this.roundsPlayed.set(this.roundsPlayed() + 1);
      }

      this.startButton().disabled = false;
    }, 0);
  }
}
