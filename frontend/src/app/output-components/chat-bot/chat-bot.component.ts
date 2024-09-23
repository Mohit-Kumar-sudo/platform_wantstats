import { Component, OnInit } from "@angular/core";
import { ChatbotService } from "src/app/services/chatbot.service";

@Component({
  selector: "app-chat-bot",
  templateUrl: "./chat-bot.component.html",
  styleUrls: ["./chat-bot.component.scss"],
})
export class ChatBotComponent implements OnInit {
  text: any;
  isOpen: boolean = false;
  isThinking: boolean = false;
  messages: any[] = [];

  constructor(private chatBotService: ChatbotService) {
    setTimeout(() => {
      this.messages.push({
        from: "bot",
        text: "Hi, I am your chatbot. How can I help you?",
        to: "user",
      });
    });
  }

  ngOnInit() {}

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    this.messages.push({
      from: "user",
      text: this.text,
      to: "bot",
    });
    let keywords = this.text.toLowerCase().split(" ");
    this.text = "";
    this.isThinking = true;
    this.chatBotService
      .getChatbotData({ text: keywords.join(" ") })
      .subscribe((res: any) => {
        if (res.data) {
          console.log("res.data",res.data)
          this.isThinking = false;
          this.messages.push({
            from: "bot",
            text: res.data,
            to: "user",
          });
        }
      });
  }
}
