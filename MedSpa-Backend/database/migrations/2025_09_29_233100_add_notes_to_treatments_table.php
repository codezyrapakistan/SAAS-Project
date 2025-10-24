<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('treatments', 'notes')) {
            Schema::table('treatments', function (Blueprint $table) {
                $table->text('notes')->nullable()->after('provider_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('treatments', 'notes')) {
            Schema::table('treatments', function (Blueprint $table) {
                $table->dropColumn('notes');
            });
        }
    }
};
