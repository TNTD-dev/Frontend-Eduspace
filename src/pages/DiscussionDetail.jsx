import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp, MoreHorizontal, Send } from 'lucide-react';
import SideBarStudent from '../components/layout/SideBarStudent';
import NavBar from '../components/layout/NavBar';
import { currentCourses, completedCourses } from '../data/mock/courseData';

const DiscussionDetail = () => {
  const { courseId, discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine current and completed courses
  const allCourses = [...currentCourses, ...completedCourses];

  useEffect(() => {
    // Simulate API call to fetch discussion details
    const fetchDiscussion = () => {
      setLoading(true);
      setTimeout(() => {
        const foundCourse = allCourses.find(c => c.id === parseInt(courseId));
        if (foundCourse) {
          setCourse(foundCourse);
          const foundDiscussion = foundCourse.discussions?.find(d => d.id === discussionId);
          setDiscussion(foundDiscussion || null);
        }
        setLoading(false);
      }, 500);
    };

    fetchDiscussion();
  }, [courseId, discussionId]);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    // Simulate API call to submit reply
    setTimeout(() => {
      // Add new reply to discussion
      const newReply = {
        id: Date.now(),
        content: replyContent,
        author: {
          id: 'current-user',
          name: 'Current User',
          role: 'student',
          avatar: '/avatars/current-user.jpg'
        },
        createdAt: 'Just now',
        likes: 0
      };

      setDiscussion(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));
      setReplyContent('');
      setIsSubmitting(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discussion || !course) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">Discussion Not Found</h2>
                  <p className="text-gray-500">The discussion you're looking for doesn't exist.</p>
                  <Link to={`/student/courses/${courseId}`} className="mt-4 inline-block text-blue-500 hover:text-blue-600">
                    Return to Course
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <NavBar />
            
            {/* Back Button */}
            <Link
              to={`/student/courses/${courseId}`}
              className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Course</span>
            </Link>

            {/* Discussion Header */}
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src={"/placeholder.jpg" || discussion.author.avatar}
                      alt={discussion.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-800">
                        {discussion.title}
                      </h1>
                      {discussion.isPinned && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">{discussion.author.name}</span>
                      <span>•</span>
                      <span>{discussion.author.role === "teacher" ? "Teacher" : "Student"}</span>
                      <span>•</span>
                      <span>{discussion.createdAt}</span>
                    </div>
                  </div>
                </div>
                <button className="rounded-full p-1 hover:bg-gray-200">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Discussion Content */}
              <div className="mb-4 text-gray-600">
                {discussion.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {discussion.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Replies ({discussion.replies?.length || 0})
              </h2>

              {/* Replies List */}
              <div className="space-y-4">
                {discussion.replies?.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          src={"/placeholder.jpg" || reply.author.avatar}
                          alt={reply.author.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {reply.author.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {reply.author.role === "teacher" ? "Teacher" : "Student"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{reply.createdAt}</span>
                      </div>
                    </div>
                    <p className="mb-3 text-gray-600">{reply.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{reply.likes} Likes</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <MessageSquare className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="mt-6">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src="/placeholder.jpg"
                        alt="Your avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !replyContent.trim()}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Reply'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;