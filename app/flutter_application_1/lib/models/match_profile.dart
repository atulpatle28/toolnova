class MatchProfile {
  const MatchProfile({
    required this.name,
    required this.age,
    required this.city,
    required this.occupation,
    required this.bio,
    required this.interests,
    required this.initials,
  });

  final String name;
  final int age;
  final String city;
  final String occupation;
  final String bio;
  final List<String> interests;
  final String initials;
}