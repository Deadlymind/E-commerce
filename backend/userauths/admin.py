from django.contrib import admin
from userauths.models import User, Profile

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "full_name", "email", "phone")

class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name", "about", "gender", "country", "city", "address")
    list_editable = ("about", "gender", "country", "city", "address")
    search_fields = ("full_name", "country", "city", "address")
    list_filter = ("date",)

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)