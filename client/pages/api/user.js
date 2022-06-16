// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({
    "name": "John",
    "email": "john@example.com",
    "avatar": "avatars/someavatar.png",
    "bio": "some biography",
    "chats": ["9128302332", "12983902183", "1978273912"]
  })
}
