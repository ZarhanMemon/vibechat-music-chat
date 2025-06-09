import Album from "../modules/albumModel.js"

export const getAlbum = async (req, res, next) => {
    try {
        const album = await Album.find();

        if (!album) {
            return res.status(404).json({ message: "album not found" });
        }

        res.status(200).json(album);
    } catch (error) {
        next(error);

    }
};


export const getAlbumSongs = async (req, res, next) => {
    try {

        const { albumId } = req.params; // Extract album ID from URL parameters
        const songs = await Album.findById(albumId).populate("songs");

        if (!songs) {
            return res.status(404).json({ message: "songs not found" });
        }

        res.status(200).json(songs);
    } catch (error) {
        next(error);

    }
}