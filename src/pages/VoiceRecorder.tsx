import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, Download, Trash2 } from "lucide-react";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      toast({ title: "Recording started" });
    } catch (error) {
      toast({ title: "Failed to access microphone", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      toast({ title: "Recording stopped" });
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement("a");
      a.href = audioURL;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
      toast({ title: "Recording downloaded" });
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    setDuration(0);
    toast({ title: "Recording cleared" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Mic className="w-8 h-8 text-primary" />
              Voice Recorder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-8 tabular-nums">
                {formatTime(duration)}
              </div>

              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="h-16 w-16 rounded-full"
                  >
                    <Mic className="w-8 h-8" />
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                    className="h-16 w-16 rounded-full"
                  >
                    <Square className="w-8 h-8" />
                  </Button>
                )}
              </div>

              {isRecording && (
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Recording...</span>
                </div>
              )}
            </div>

            {audioURL && !isRecording && (
              <div className="space-y-4 animate-fade-in">
                <audio controls className="w-full" src={audioURL} />

                <div className="flex gap-2">
                  <Button onClick={downloadRecording} className="flex-1" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={clearRecording}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceRecorder;
