import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Edit, Trash, Tag as TagIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { tagsAPI } from "@/api"
import { toast } from "sonner"


export function TagManager({ open, onOpenChange, onTagsChange }) {
  const [activeTab, setActiveTab] = useState("view")
  const [editingTag, setEditingTag] = useState(null)
  const [tags, setTags] = useState([])

  // New tag form state
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6") // Default blue color

  // Edit tag form state
  const [editTagName, setEditTagName] = useState("")
  const [editTagColor, setEditTagColor] = useState("")

  // Fetch tags when component mounts
  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getTags();
      setTags(response.data);
      if (onTagsChange) {
        onTagsChange(response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    }
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    try {
      const newTag = {
        name: newTagName,
        bgColor: `bg-[${newTagColor}]/10`,
        textColor: `text-[${newTagColor}]`,
        borderColor: `border-l-[${newTagColor}]`,
      };

      const response = await tagsAPI.createTag(newTag);
      setTags(prev => [...prev, response.data]);
      if (onTagsChange) {
        onTagsChange([...tags, response.data]);
      }
      
      setNewTagName("");
      setNewTagColor("#3b82f6");
      setActiveTab("view");
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);

    // Extract color from borderColor
    const colorMatch = tag.borderColor.match(/border-l-\[(.*?)\]/);
    if (colorMatch && colorMatch[1]) {
      setEditTagColor(colorMatch[1]);
    } else {
      // Default fallback
      setEditTagColor("#3b82f6");
    }

    setActiveTab("edit");
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;
    if (!editTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    try {
      const updatedTag = {
        name: editTagName,
        bgColor: `bg-[${editTagColor}]/10`,
        textColor: `text-[${editTagColor}]`,
        borderColor: `border-l-[${editTagColor}]`,
      };

      await tagsAPI.updateTag(editingTag.id, updatedTag);
      await fetchTags(); // Fetch updated tags after successful update

      setEditingTag(null);
      setActiveTab("view");
      toast.success('Tag updated successfully');
    } catch (error) {
      console.error('Error updating tag:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update tag');
      }
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      try {
        await tagsAPI.deleteTag(tagId);
        setTags(prev => prev.filter(tag => tag.id !== tagId));
        if (onTagsChange) {
          onTagsChange(tags.filter(tag => tag.id !== tagId));
        }
        toast.success('Tag deleted successfully');
      } catch (error) {
        console.error('Error deleting tag:', error);
        toast.error('Failed to delete tag');
      }
    }
  };

  const handleClose = () => {
    setActiveTab("view");
    setEditingTag(null);
    setNewTagName("");
    setNewTagColor("#3b82f6");
    onOpenChange(false);
  };

  // Helper function to render tag preview
  const renderTagPreview = (name, color) => {
    return (
      <div className="mt-4 p-4 border rounded-md">
        <h4 className="text-sm font-medium mb-2">Preview:</h4>
        <div
          className="inline-flex items-center px-3 py-1 rounded-md border-l-4 hover:shadow-md transition-shadow"
          style={{
            borderLeftColor: color,
            backgroundColor: `${color}10`,
            color: color,
          }}
        >
          <TagIcon className="w-3 h-3 mr-1" />
          <span>{name || "Tag Name"}</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="view">View Tags</TabsTrigger>
            <TabsTrigger value="add">Add Tag</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingTag}>
              Edit Tag
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={cn(
                    "flex items-center justify-between p-2 border rounded-md",
                    "hover:bg-gray-50 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border-l-4"
                      style={{
                        borderLeftColor: tag.borderColor.replace('border-l-[', '').replace(']', ''),
                        backgroundColor: tag.bgColor.replace('bg-[', '').replace(']/10', '') + '10',
                      }}
                    />
                    <span
                      style={{
                        color: tag.textColor.replace('text-[', '').replace(']', '')
                      }}
                      className="font-medium"
                    >
                      {tag.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTag(tag)}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTag(tag.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div>
              <Label htmlFor="newTagName">Tag Name</Label>
              <Input
                id="newTagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newTagColor">Tag Color</Label>
              <Input
                id="newTagColor"
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="mt-1 h-10"
              />
            </div>
            {renderTagPreview(newTagName, newTagColor)}
            <DialogFooter>
              <Button 
                variant="secondary" 
                onClick={() => setActiveTab("view")}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddNewTag}
                className="bg-[#1f53f5] text-white hover:bg-[#1f53f5]/90"
              >
                Add Tag
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <div>
              <Label htmlFor="editTagName">Tag Name</Label>
              <Input
                id="editTagName"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                placeholder="Enter tag name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editTagColor">Tag Color</Label>
              <Input
                id="editTagColor"
                type="color"
                value={editTagColor}
                onChange={(e) => setEditTagColor(e.target.value)}
                className="mt-1 h-10"
              />
            </div>
            {renderTagPreview(editTagName, editTagColor)}
            <DialogFooter>
              <Button 
                variant="secondary" 
                onClick={() => setActiveTab("view")}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTag}
                className="bg-[#1f53f5] text-white hover:bg-[#1f53f5]/90"
              >
                Update Tag
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
