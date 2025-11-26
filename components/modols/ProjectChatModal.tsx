import { useState, useEffect, useRef, useMemo } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/config/Firebase";
import { useUserContextId } from "@/app/context/AuthContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useProjectContext } from "@/app/context/projectContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Loader2 } from "lucide-react";
import Loader from "../Loader";

export default function ProjectChatModal({ projectId }: { projectId: string }) {
  const { userContextId } = useUserContextId();
  const { userData } = useProjectContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectSnap = await getDoc(doc(db, "Projects", projectId));
        if (projectSnap.exists()) {
          const data = projectSnap.data();
          setAssignedUsers(data?.assignedUsers || []);
          setOwnerId(data?.userId || null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const q = query(
      collection(db, "Projects", projectId, "chat"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.reverse());
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.size === 10);
    });

    return () => unsubscribe();
  }, [projectId]);

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);

    const scrollPos = scrollContainerRef.current?.scrollHeight || 0;

    const next = query(
      collection(db, "Projects", projectId, "chat"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snapshot = await getDocs(next);
    const newMsgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (newMsgs.length > 0) {
      setMessages((prev) => [...newMsgs.reverse(), ...prev]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.size === 10);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight - scrollPos;
      }
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await addDoc(collection(db, "Projects", projectId, "chat"), {
        text: message,
        senderId: userData?.id || userContextId,
        senderName: userData?.fullname || "Unknown",
        senderPhoto: userData?.avatar || "",
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
  };

  // 🧠 Check if user can chat
  const canChat = useMemo(
    () =>
      ownerId === userContextId ||
      assignedUsers.includes(userContextId!) ||
      assignedUsers.includes(userData?.id || ""),
    [ownerId, assignedUsers, userContextId, userData?.id]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300"
        >
          <MessageCircle size={26} />
        </Button>
      </DialogTrigger>

      {/* Changed max-w-5xl to dynamic width for mobile and added w-full */}
      <DialogContent className="w-[95vw] sm:w-full md:max-w-5xl p-0 rounded-xl shadow-2xl border border-border/40">
        <DialogHeader className="p-4 border-b bg-linear-to-r from-muted/40 via-muted/20 to-muted/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Project Chat
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Collaborate and communicate with your team in real time.
              </DialogDescription>
            </div>
            <Badge variant="outline" className="px-2 py-1 rounded-md">
              Live
            </Badge>
          </div>
        </DialogHeader>

        {/* Changed layout from flex row to flex-col on mobile, flex-row on desktop */}
        <div className="flex flex-col md:flex-row h-[80vh] md:h-[65vh]">
          {loading ? (
            // Fixed the hardcoded padding px-[480px] to flexible center
            <div className="flex w-full h-full justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Participants Sidebar */}
              {/* Added h-auto with max-height on mobile to prevent taking up full screen, normal width on desktop */}
              <div className="w-full md:w-1/3 h-auto max-h-[120px] md:max-h-full border-b md:border-b-0 md:border-r bg-muted/10 flex flex-col">
                <div className="p-3 md:p-4 border-b hidden md:block">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                    Participants
                  </h3>
                </div>

                {/* Sidebar ScrollArea */}
                <ScrollArea className="flex-1 p-2 h-min md:p-4 space-y-2">
                  <div className="flex flex-row md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-hidden">
                    {userData && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-transparent hover:border-border transition cursor-pointer min-w-[150px] md:min-w-0">
                        <Avatar className="w-8 h-8 md:w-9 md:h-9 border">
                          {userData.avatar ? (
                            <AvatarImage src={userData.avatar} />
                          ) : (
                            <AvatarFallback>
                              {userData.fullname?.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate max-w-20 md:max-w-none">
                            {userData.fullname}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs ml-auto hidden md:inline-flex"
                        >
                          You
                        </Badge>
                      </div>
                    )}

                    <Separator className="hidden md:block my-3" />

                    {assignedUsers.length > 0 ? (
                      assignedUsers.map((userId, i) => {
                        if (userId === userData?.id) return null;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition cursor-pointer min-w-[150px] md:min-w-0"
                          >
                            <Avatar className="w-8 h-8 md:w-9 md:h-9 border">
                              <AvatarFallback>
                                {userId.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium truncate max-w-[100px] md:max-w-none">
                              {userId}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground italic p-2 hidden md:block">
                        No assigned members.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area - Added flex-1 and min-h-0 to handle flex scrolling correctly */}
              <div className="flex-1 flex flex-col bg-background ">
                <ScrollArea
                  ref={scrollContainerRef}
                  className="flex-1 px-4 py-2 h-[40vh]" // Removed fixed h-[40vh]
                >
                  <div className="space-y-4 pb-4">
                    {hasMore && (
                      <div className="flex justify-center mb-3 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={loadMore}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading..." : "Load older messages"}
                        </Button>
                      </div>
                    )}

                    {messages.map((msg) => {
                      const isUser = msg.senderId === userContextId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isUser ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] md:max-w-[75%] p-3 rounded-2xl shadow-sm border ${
                              isUser
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-6 h-6 border">
                                <AvatarImage src={msg.senderPhoto} />
                                <AvatarFallback className="text-black dark:text-white">
                                  {msg.senderName?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`text-xs font-medium ${
                                  isUser
                                    ? "text-blue-100"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {msg.senderName}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator />

                {canChat && assignedUsers?.length > 0 ? (
                  <form
                    onSubmit={sendMessage}
                    className="flex flex-col gap-1 p-3 border-t bg-muted/10 backdrop-blur"
                  >
                    {typing && (
                      <p className="text-xs text-muted-foreground mb-2 px-3">
                        {userData?.fullname || "You"} are typing...
                      </p>
                    )}
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleTyping}
                        className="flex-1 border rounded-full px-4"
                        disabled={sending}
                      />
                      <Button
                        type="submit"
                        disabled={!message.trim() || sending}
                        className="rounded-full px-4 md:px-6 flex items-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="animate-spin w-4 h-4 text-white" />
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    You’re not a participant of this project.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
