import { supabase } from "../lib/supabase.js";
import prisma from "../lib/prisma.js";

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Check if user already has avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (user.avatar) {
      return res.status(400).json({
        message:
          "You already have an avatar. Delete it first before uploading a new one.",
      });
    }

    // 2. Continue upload if no avatar
    const file = req.file;

    const fileName = `avatar-${userId}-${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName)
      .data.publicUrl;

    // 3. Save to DB
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: publicUrl },
    });

    res.json({
      message: "Avatar uploaded successfully",
      avatar: publicUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user || !user.avatar) {
      return res.status(400).json({ message: "No avatar to delete" });
    }

    const avatarUrl = user.avatar;

    // 2. If Google avatar → just clear DB
    if (avatarUrl.includes("googleusercontent.com")) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null },
      });

      return res.json({ message: "Avatar removed (Google avatar)" });
    }

    // 3. Extract file path from Supabase URL
    const filePath = avatarUrl.split("/avatars/")[1];

    // 4. Delete from Supabase Storage
    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // 5. Update DB
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });

    res.json({ message: "Avatar deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
