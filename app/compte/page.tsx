<?php
session_start();

$error = "";
$success = "";
$users_file = 'users.json';

// Si l'utilisateur est déjà connecté, on l'envoie au dashboard
if (isset($_SESSION['user'])) {
    header("Location: dashboard.php");
    exit;
}

// Traitement des formulaires
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST['action'] ?? '';
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Charger les utilisateurs existants
    $users = [];
    if (file_exists($users_file)) {
        $users = json_decode(file_get_contents($users_file), true) ?? [];
    }

    if ($action === "register") {
        // --- INSCRIPTION ---
        if (isset($users[$username])) {
            $error = "Cet identifiant existe déjà !";
        } elseif (empty($username) || empty($password)) {
            $error = "Tous les champs sont obligatoires.";
        } else {
            // On hache le mot de passe pour la sécurité
            $users[$username] = password_hash($password, PASSWORD_DEFAULT);
            file_put_contents($users_file, json_encode($users));
            $success = "Inscription réussie ! Connectez-vous.";
        }
    } elseif ($action === "login") {
        // --- CONNEXION ---
        if (isset($users[$username]) && password_verify($password, $users[$username])) {
            $_SESSION['user'] = $username;
            header("Location: dashboard.php");
            exit;
        } else {
            $error = "Identifiants incorrects.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion & Inscription</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; height: 100vh; color: #fff; }
        .container { background: #162447; padding: 30px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); width: 100%; max-width: 400px; text-align: center; }
        h2 { margin-bottom: 20px; color: #e43f5a; font-size: 24px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 6px; background: #1f4068; color: #fff; font-size: 16px; }
        input::placeholder { color: #b5b5b5; }
        button { width: 100%; padding: 12px; border: none; border-radius: 6px; background: #e43f5a; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        button:hover { background: #ca3e54; }
        .msg { padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; }
        .error { background: #ca3e54; color: white; }
        .success { background: #2ecc71; color: white; }
        .toggle-link { margin-top: 15px; font-size: 14px; color: #b5b5b5; }
        .toggle-link span { color: #e43f5a; cursor: pointer; text-decoration: underline; }
        .hidden { display: none; }
    </style>
</head>
<body>

<div class="container">
    <?php if ($error): ?> <div class="msg error"><?= $error ?></div> <?php endif; ?>
    <?php if ($success): ?> <div class="msg success"><?= $success ?></div> <?php endif; ?>

    <div id="login-box">
        <h2>Connexion</h2>
        <form method="POST">
            <input type="hidden" name="action" value="login">
            <input type="text" name="username" placeholder="Identifiant" required>
            <input type="password" name="password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <div class="toggle-link">Pas encore de compte ? <span onclick="toggleForm()">S'inscrire</span></div>
    </div>

    <div id="register-box" class="hidden">
        <h2>Inscription</h2>
        <form method="POST">
            <input type="hidden" name="action" value="register">
            <input type="text" name="username" placeholder="Choisissez un identifiant" required>
            <input type="password" name="password" placeholder="Créez un mot de passe" required>
            <button type="submit">Créer le compte</button>
        </form>
        <div class="toggle-link">Déjà un compte ? <span onclick="toggleForm()">Se connecter</span></div>
    </div>
</div>

<script>
    function toggleForm() {
        document.getElementById('login-box').classList.toggle('hidden');
        document.getElementById('register-box').classList.toggle('hidden');
    }
</script>

</body>
</html>